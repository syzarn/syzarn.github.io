//! Encode a source file into a decayfmt file.
//!
//! This module reads a source image or text file, builds the fixed header via
//! format.rs, and writes the header followed by the raw, uncorrupted payload. The
//! invariant it upholds is that encoding never corrupts: a freshly encoded file is
//! clean. Corruption only ever happens at open time, in open.rs. All file I/O for
//! the encode flow lives here.

use crate::error::DecayError;
use crate::format::{FileType, Header};
use std::fs;
use std::path::Path;

/// Decodes a source image's bytes into its pixel dimensions and a raw RGBA payload.
///
/// The image crate accepts any format it supports (PNG, JPEG, and others) and is
/// reduced here to raw RGBA, four bytes per pixel, which is exactly what the
/// decayfmt payload stores. The dimensions are returned alongside so the header can
/// record them; the payload is the pixel data only and does not encode its own size.
fn decode_image(source_bytes: &[u8], input: &Path) -> Result<(u32, u32, Vec<u8>), DecayError> {
    let decoded =
        image::load_from_memory(source_bytes).map_err(|error| DecayError::ImageDecode {
            context: format!("encode: decode image '{}': {}", input.display(), error),
        })?;
    let rgba = decoded.to_rgba8();
    let (width, height) = rgba.dimensions();
    Ok((width, height, rgba.into_raw()))
}

/// Produces a raw text payload from source bytes, requiring valid UTF-8.
///
/// The payload is stored as raw UTF-8 bytes exactly as read. Invalid UTF-8 is
/// refused at encode time so that only well-formed text ever enters the format;
/// the later corruption at open time is what may break that validity.
fn text_payload(source_bytes: Vec<u8>) -> Result<Vec<u8>, DecayError> {
    match std::str::from_utf8(&source_bytes) {
        Ok(_) => Ok(source_bytes),
        Err(_) => Err(DecayError::InvalidUtf8),
    }
}

/// Writes the header and raw payload to the output path as a single file.
///
/// The header is written exactly once, here, and is never rewritten afterward.
/// The payload follows immediately after the fixed 16-byte header.
fn write_decayfmt(output: &Path, header: Header, payload: &[u8]) -> Result<(), DecayError> {
    let header_bytes = header.write();
    let mut file_bytes = Vec::with_capacity(header_bytes.len() + payload.len());
    file_bytes.extend_from_slice(&header_bytes);
    file_bytes.extend_from_slice(payload);
    fs::write(output, &file_bytes).map_err(|error| DecayError::Io {
        context: format!("encode: write output '{}'", output.display()),
        source: error,
    })
}

/// Encodes a source file at `input` into a decayfmt file at `output`.
///
/// The payload type and the instability value x both come from the output filename
/// (`name.idcy<x>` or `name.tdcy<x>`), parsed by the same routine open uses, so an
/// output name that could never be opened, a missing or malformed x, is refused here
/// rather than producing a permanently unopenable file. The source is read and turned
/// into a raw payload (RGBA for images, UTF-8 for text), and the header plus payload
/// are written out. No corruption is applied; the produced file is clean and parses
/// cleanly via format.rs. The value of x is not stored; it lives only in the filename.
pub fn encode_file(input: &Path, output: &Path) -> Result<(), DecayError> {
    let (file_type, _x) = crate::format::parse_filename(output)?;

    let source_bytes = fs::read(input).map_err(|error| DecayError::Io {
        context: format!("encode: read input '{}'", input.display()),
        source: error,
    })?;

    let (header, payload) = match file_type {
        FileType::Image => {
            let (width, height, payload) = decode_image(&source_bytes, input)?;
            (Header::for_image(width, height), payload)
        }
        FileType::Text => (Header::for_text(), text_payload(source_bytes)?),
    };

    write_decayfmt(output, header, &payload)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::format::{ImageDimensions, FILE_TYPE_TEXT, HEADER_SIZE, MAGIC, VERSION};
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    /// Builds a unique path in the system temp directory so concurrent test runs do
    /// not collide. The suffix carries the extension the test needs.
    fn unique_temp_path(suffix: &str) -> PathBuf {
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system clock before unix epoch")
            .as_nanos();
        std::env::temp_dir().join(format!("decayfmt_test_{}_{}", nanos, suffix))
    }

    #[test]
    fn encode_text_writes_header_and_exact_payload() {
        let source = b"the quick brown fox jumps over the lazy dog";
        let input = unique_temp_path("source.txt");
        let output = unique_temp_path("note.tdcy3");
        fs::write(&input, source).expect("write test source");

        encode_file(&input, &output).expect("encode text should succeed");

        let written = fs::read(&output).expect("read encoded file");
        assert_eq!(&written[0..4], &MAGIC, "magic bytes must be DCYF");
        assert_eq!(written[4], VERSION, "version byte must match");
        assert_eq!(written[5], FILE_TYPE_TEXT, "file_type byte must be text");
        assert_eq!(
            &written[HEADER_SIZE..],
            source,
            "text payload must match source bytes exactly"
        );

        let _ = fs::remove_file(&input);
        let _ = fs::remove_file(&output);
    }

    #[test]
    fn encode_image_payload_length_matches_dimensions() {
        // A known 2x2 image has a payload of exactly width * height * 4 bytes.
        let width = 2u32;
        let height = 2u32;
        let source_image = image::RgbaImage::from_fn(width, height, |x, y| {
            image::Rgba([x as u8 * 10, y as u8 * 10, 20, 255])
        });
        let input = unique_temp_path("source.png");
        let output = unique_temp_path("photo.idcy3");
        source_image.save(&input).expect("save test png");

        encode_file(&input, &output).expect("encode image should succeed");

        let written = fs::read(&output).expect("read encoded file");
        assert_eq!(&written[0..4], &MAGIC, "magic bytes must be DCYF");
        assert_eq!(written[4], VERSION, "version byte must match");
        let payload_len = written.len() - HEADER_SIZE;
        assert_eq!(
            payload_len,
            (width * height * 4) as usize,
            "image payload must be width * height * 4 bytes"
        );

        let header = Header::read(&written).expect("encoded header must parse");
        assert_eq!(
            header.dimensions,
            Some(ImageDimensions { width, height }),
            "header must record the source image dimensions"
        );

        let _ = fs::remove_file(&input);
        let _ = fs::remove_file(&output);
    }
}
