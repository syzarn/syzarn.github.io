/**
 * invoice-generator.js
 * modular client-side invoice & receipt generator
 * features:
 * - zero server footprint (100% client side)
 * - arbitrary precision minor units (integer cents/poisha) financial math
 * - true vector output via native iframe @media print (no raster canvas)
 * - 4 core barcode symbologies: Code 128, QR Code, Data Matrix, EAN-13 / UPC-A
 * - 6 templates: stripe-modern, thermal-pos (80mm/58mm), minimal-classic, bn-vintage-ledger, mid-century-tractor, erp-classic-90s
 * - client-side logo upload & base64 encoding
 * - traditional bengali memo/ledger with Kobiguru, Biro Script Plus, Confidential Regular,
 *   bengali numerals, and number-to-words currency converter
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InvoiceGenerator = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --- currency metadata (complete ISO 4217 fiat + major cryptocurrencies) ---
  const CURRENCIES = {
    // popular & regional (default BDT first)
    BDT: { symbol: '৳', name: 'BDT - Bangladeshi Taka (৳)', decimals: 2, position: 'pre', group: 'popular' },
    USD: { symbol: '$', name: 'USD - US Dollar ($)', decimals: 2, position: 'pre', group: 'popular' },
    EUR: { symbol: '€', name: 'EUR - Euro (€)', decimals: 2, position: 'pre', group: 'popular' },
    GBP: { symbol: '£', name: 'GBP - British Pound (£)', decimals: 2, position: 'pre', group: 'popular' },
    INR: { symbol: '₹', name: 'INR - Indian Rupee (₹)', decimals: 2, position: 'pre', group: 'popular' },
    AED: { symbol: 'د.إ', name: 'AED - UAE Dirham (د.إ)', decimals: 2, position: 'post', group: 'popular' },
    SAR: { symbol: '﷼', name: 'SAR - Saudi Riyal (﷼)', decimals: 2, position: 'post', group: 'popular' },
    CAD: { symbol: 'C$', name: 'CAD - Canadian Dollar (C$)', decimals: 2, position: 'pre', group: 'popular' },
    AUD: { symbol: 'A$', name: 'AUD - Australian Dollar (A$)', decimals: 2, position: 'pre', group: 'popular' },
    SGD: { symbol: 'S$', name: 'SGD - Singapore Dollar (S$)', decimals: 2, position: 'pre', group: 'popular' },
    MYR: { symbol: 'RM', name: 'MYR - Malaysian Ringgit (RM)', decimals: 2, position: 'pre', group: 'popular' },
    JPY: { symbol: '¥', name: 'JPY - Japanese Yen (¥)', decimals: 0, position: 'pre', group: 'popular' },
    CNY: { symbol: '¥', name: 'CNY - Chinese Yuan (¥)', decimals: 2, position: 'pre', group: 'popular' },

    // complete fiat currencies (a-z)
    AFN: { symbol: '؋', name: 'AFN - Afghan Afghani (؋)', decimals: 2, position: 'pre', group: 'fiat' },
    ALL: { symbol: 'L', name: 'ALL - Albanian Lek (L)', decimals: 2, position: 'post', group: 'fiat' },
    AMD: { symbol: '֏', name: 'AMD - Armenian Dram (֏)', decimals: 2, position: 'post', group: 'fiat' },
    ANG: { symbol: 'ƒ', name: 'ANG - Netherlands Antillean Guilder (ƒ)', decimals: 2, position: 'pre', group: 'fiat' },
    AOA: { symbol: 'Kz', name: 'AOA - Angolan Kwanza (Kz)', decimals: 2, position: 'post', group: 'fiat' },
    ARS: { symbol: '$', name: 'ARS - Argentine Peso ($)', decimals: 2, position: 'pre', group: 'fiat' },
    AWG: { symbol: 'ƒ', name: 'AWG - Aruban Florin (ƒ)', decimals: 2, position: 'pre', group: 'fiat' },
    AZN: { symbol: '₼', name: 'AZN - Azerbaijani Manat (₼)', decimals: 2, position: 'pre', group: 'fiat' },
    BAM: { symbol: 'KM', name: 'BAM - Bosnia & Herzegovina Convertible Mark (KM)', decimals: 2, position: 'post', group: 'fiat' },
    BBD: { symbol: 'Bds$', name: 'BBD - Barbadian Dollar (Bds$)', decimals: 2, position: 'pre', group: 'fiat' },
    BGN: { symbol: 'лв', name: 'BGN - Bulgarian Lev (лв)', decimals: 2, position: 'post', group: 'fiat' },
    BHD: { symbol: 'BD', name: 'BHD - Bahraini Dinar (BD)', decimals: 3, position: 'post', group: 'fiat' },
    BIF: { symbol: 'FBu', name: 'BIF - Burundian Franc (FBu)', decimals: 0, position: 'post', group: 'fiat' },
    BMD: { symbol: '$', name: 'BMD - Bermudan Dollar ($)', decimals: 2, position: 'pre', group: 'fiat' },
    BND: { symbol: 'B$', name: 'BND - Brunei Dollar (B$)', decimals: 2, position: 'pre', group: 'fiat' },
    BOB: { symbol: 'Bs.', name: 'BOB - Bolivian Boliviano (Bs.)', decimals: 2, position: 'pre', group: 'fiat' },
    BRL: { symbol: 'R$', name: 'BRL - Brazilian Real (R$)', decimals: 2, position: 'pre', group: 'fiat' },
    BSD: { symbol: 'B$', name: 'BSD - Bahamian Dollar (B$)', decimals: 2, position: 'pre', group: 'fiat' },
    BTN: { symbol: 'Nu.', name: 'BTN - Bhutanese Ngultrum (Nu.)', decimals: 2, position: 'pre', group: 'fiat' },
    BWP: { symbol: 'P', name: 'BWP - Botswanan Pula (P)', decimals: 2, position: 'pre', group: 'fiat' },
    BYN: { symbol: 'Br', name: 'BYN - Belarusian Ruble (Br)', decimals: 2, position: 'post', group: 'fiat' },
    BZD: { symbol: 'BZ$', name: 'BZD - Belize Dollar (BZ$)', decimals: 2, position: 'pre', group: 'fiat' },
    CDF: { symbol: 'FC', name: 'CDF - Congolese Franc (FC)', decimals: 2, position: 'post', group: 'fiat' },
    CHF: { symbol: 'CHF', name: 'CHF - Swiss Franc (CHF)', decimals: 2, position: 'pre', group: 'fiat' },
    CLP: { symbol: '$', name: 'CLP - Chilean Peso ($)', decimals: 0, position: 'pre', group: 'fiat' },
    COP: { symbol: '$', name: 'COP - Colombian Peso ($)', decimals: 2, position: 'pre', group: 'fiat' },
    CRC: { symbol: '₡', name: 'CRC - Costa Rican Colón (₡)', decimals: 2, position: 'pre', group: 'fiat' },
    CUP: { symbol: '$', name: 'CUP - Cuban Peso ($)', decimals: 2, position: 'pre', group: 'fiat' },
    CVE: { symbol: 'Esc', name: 'CVE - Cape Verdean Escudo (Esc)', decimals: 2, position: 'post', group: 'fiat' },
    CZK: { symbol: 'Kč', name: 'CZK - Czech Koruna (Kč)', decimals: 2, position: 'post', group: 'fiat' },
    DJF: { symbol: 'Fdj', name: 'DJF - Djiboutian Franc (Fdj)', decimals: 0, position: 'post', group: 'fiat' },
    DKK: { symbol: 'kr', name: 'DKK - Danish Krone (kr)', decimals: 2, position: 'post', group: 'fiat' },
    DOP: { symbol: 'RD$', name: 'DOP - Dominican Peso (RD$)', decimals: 2, position: 'pre', group: 'fiat' },
    DZD: { symbol: 'DA', name: 'DZD - Algerian Dinar (DA)', decimals: 2, position: 'post', group: 'fiat' },
    EGP: { symbol: 'E£', name: 'EGP - Egyptian Pound (E£)', decimals: 2, position: 'pre', group: 'fiat' },
    ERN: { symbol: 'Nfk', name: 'ERN - Eritrean Nakfa (Nfk)', decimals: 2, position: 'post', group: 'fiat' },
    ETB: { symbol: 'Br', name: 'ETB - Ethiopian Birr (Br)', decimals: 2, position: 'pre', group: 'fiat' },
    FJD: { symbol: 'FJ$', name: 'FJD - Fijian Dollar (FJ$)', decimals: 2, position: 'pre', group: 'fiat' },
    FKP: { symbol: '£', name: 'FKP - Falkland Islands Pound (£)', decimals: 2, position: 'pre', group: 'fiat' },
    GEL: { symbol: '₾', name: 'GEL - Georgian Lari (₾)', decimals: 2, position: 'pre', group: 'fiat' },
    GHS: { symbol: 'GH₵', name: 'GHS - Ghanaian Cedi (GH₵)', decimals: 2, position: 'pre', group: 'fiat' },
    GIP: { symbol: '£', name: 'GIP - Gibraltar Pound (£)', decimals: 2, position: 'pre', group: 'fiat' },
    GMD: { symbol: 'D', name: 'GMD - Gambian Dalasi (D)', decimals: 2, position: 'post', group: 'fiat' },
    GNF: { symbol: 'FG', name: 'GNF - Guinean Franc (FG)', decimals: 0, position: 'post', group: 'fiat' },
    GTQ: { symbol: 'Q', name: 'GTQ - Guatemalan Quetzal (Q)', decimals: 2, position: 'pre', group: 'fiat' },
    GYD: { symbol: 'G$', name: 'GYD - Guyanese Dollar (G$)', decimals: 2, position: 'pre', group: 'fiat' },
    HKD: { symbol: 'HK$', name: 'HKD - Hong Kong Dollar (HK$)', decimals: 2, position: 'pre', group: 'fiat' },
    HNL: { symbol: 'L', name: 'HNL - Honduran Lempira (L)', decimals: 2, position: 'pre', group: 'fiat' },
    HRK: { symbol: 'kn', name: 'HRK - Croatian Kuna (kn)', decimals: 2, position: 'post', group: 'fiat' },
    HTG: { symbol: 'G', name: 'HTG - Haitian Gourde (G)', decimals: 2, position: 'post', group: 'fiat' },
    HUF: { symbol: 'Ft', name: 'HUF - Hungarian Forint (Ft)', decimals: 2, position: 'post', group: 'fiat' },
    IDR: { symbol: 'Rp', name: 'IDR - Indonesian Rupiah (Rp)', decimals: 2, position: 'pre', group: 'fiat' },
    ILS: { symbol: '₪', name: 'ILS - Israeli New Shekel (₪)', decimals: 2, position: 'pre', group: 'fiat' },
    IQD: { symbol: 'ID', name: 'IQD - Iraqi Dinar (ID)', decimals: 3, position: 'post', group: 'fiat' },
    IRR: { symbol: '﷼', name: 'IRR - Iranian Rial (﷼)', decimals: 0, position: 'post', group: 'fiat' },
    ISK: { symbol: 'kr', name: 'ISK - Icelandic Króna (kr)', decimals: 0, position: 'post', group: 'fiat' },
    JMD: { symbol: 'J$', name: 'JMD - Jamaican Dollar (J$)', decimals: 2, position: 'pre', group: 'fiat' },
    JOD: { symbol: 'JD', name: 'JOD - Jordanian Dinar (JD)', decimals: 3, position: 'post', group: 'fiat' },
    KES: { symbol: 'KSh', name: 'KES - Kenyan Shilling (KSh)', decimals: 2, position: 'pre', group: 'fiat' },
    KGS: { symbol: 'с', name: 'KGS - Kyrgystani Som (с)', decimals: 2, position: 'post', group: 'fiat' },
    KHR: { symbol: '៛', name: 'KHR - Cambodian Riel (៛)', decimals: 2, position: 'post', group: 'fiat' },
    KMF: { symbol: 'CF', name: 'KMF - Comorian Franc (CF)', decimals: 0, position: 'post', group: 'fiat' },
    KPW: { symbol: '₩', name: 'KPW - North Korean Won (₩)', decimals: 0, position: 'pre', group: 'fiat' },
    KRW: { symbol: '₩', name: 'KRW - South Korean Won (₩)', decimals: 0, position: 'pre', group: 'fiat' },
    KWD: { symbol: 'KD', name: 'KWD - Kuwaiti Dinar (KD)', decimals: 3, position: 'post', group: 'fiat' },
    KYD: { symbol: 'CI$', name: 'KYD - Cayman Islands Dollar (CI$)', decimals: 2, position: 'pre', group: 'fiat' },
    KZT: { symbol: '₸', name: 'KZT - Kazakhstani Tenge (₸)', decimals: 2, position: 'pre', group: 'fiat' },
    LAK: { symbol: '₭', name: 'LAK - Laotian Kip (₭)', decimals: 2, position: 'pre', group: 'fiat' },
    LBP: { symbol: 'L£', name: 'LBP - Lebanese Pound (L£)', decimals: 2, position: 'pre', group: 'fiat' },
    LKR: { symbol: 'Rs', name: 'LKR - Sri Lankan Rupee (Rs)', decimals: 2, position: 'pre', group: 'fiat' },
    LRD: { symbol: 'L$', name: 'LRD - Liberian Dollar (L$)', decimals: 2, position: 'pre', group: 'fiat' },
    LSL: { symbol: 'M', name: 'LSL - Lesotho Loti (M)', decimals: 2, position: 'post', group: 'fiat' },
    LYD: { symbol: 'LD', name: 'LYD - Libyan Dinar (LD)', decimals: 3, position: 'post', group: 'fiat' },
    MAD: { symbol: 'MAD', name: 'MAD - Moroccan Dirham (MAD)', decimals: 2, position: 'post', group: 'fiat' },
    MDL: { symbol: 'L', name: 'MDL - Moldovan Leu (L)', decimals: 2, position: 'post', group: 'fiat' },
    MGA: { symbol: 'Ar', name: 'MGA - Malagasy Ariary (Ar)', decimals: 0, position: 'post', group: 'fiat' },
    MKD: { symbol: 'ден', name: 'MKD - Macedonian Denar (ден)', decimals: 2, position: 'post', group: 'fiat' },
    MMK: { symbol: 'K', name: 'MMK - Myanmar Kyat (K)', decimals: 2, position: 'post', group: 'fiat' },
    MNT: { symbol: '₮', name: 'MNT - Mongolian Tugrik (₮)', decimals: 2, position: 'pre', group: 'fiat' },
    MOP: { symbol: 'MOP$', name: 'MOP - Macanese Pataca (MOP$)', decimals: 2, position: 'pre', group: 'fiat' },
    MRU: { symbol: 'UM', name: 'MRU - Mauritanian Ouguiya (UM)', decimals: 2, position: 'post', group: 'fiat' },
    MUR: { symbol: '₨', name: 'MUR - Mauritian Rupee (₨)', decimals: 2, position: 'pre', group: 'fiat' },
    MVR: { symbol: 'Rf', name: 'MVR - Maldivian Rufiyaa (Rf)', decimals: 2, position: 'post', group: 'fiat' },
    MWK: { symbol: 'MK', name: 'MWK - Malawian Kwacha (MK)', decimals: 2, position: 'pre', group: 'fiat' },
    MXN: { symbol: 'Mex$', name: 'MXN - Mexican Peso (Mex$)', decimals: 2, position: 'pre', group: 'fiat' },
    MZN: { symbol: 'MT', name: 'MZN - Mozambican Metical (MT)', decimals: 2, position: 'post', group: 'fiat' },
    NAD: { symbol: 'N$', name: 'NAD - Namibian Dollar (N$)', decimals: 2, position: 'pre', group: 'fiat' },
    NGN: { symbol: '₦', name: 'NGN - Nigerian Naira (₦)', decimals: 2, position: 'pre', group: 'fiat' },
    NIO: { symbol: 'C$', name: 'NIO - Nicaraguan Córdoba (C$)', decimals: 2, position: 'pre', group: 'fiat' },
    NOK: { symbol: 'kr', name: 'NOK - Norwegian Krone (kr)', decimals: 2, position: 'post', group: 'fiat' },
    NPR: { symbol: 'Rs', name: 'NPR - Nepalese Rupee (Rs)', decimals: 2, position: 'pre', group: 'fiat' },
    NZD: { symbol: 'NZ$', name: 'NZD - New Zealand Dollar (NZ$)', decimals: 2, position: 'pre', group: 'fiat' },
    OMR: { symbol: 'RO', name: 'OMR - Omani Rial (RO)', decimals: 3, position: 'post', group: 'fiat' },
    PAB: { symbol: 'B/.', name: 'PAB - Panamanian Balboa (B/.)', decimals: 2, position: 'pre', group: 'fiat' },
    PEN: { symbol: 'S/.', name: 'PEN - Peruvian Sol (S/.)', decimals: 2, position: 'pre', group: 'fiat' },
    PGK: { symbol: 'K', name: 'PGK - Papua New Guinean Kina (K)', decimals: 2, position: 'pre', group: 'fiat' },
    PHP: { symbol: '₱', name: 'PHP - Philippine Peso (₱)', decimals: 2, position: 'pre', group: 'fiat' },
    PKR: { symbol: 'Rs', name: 'PKR - Pakistani Rupee (Rs)', decimals: 2, position: 'pre', group: 'fiat' },
    PLN: { symbol: 'zł', name: 'PLN - Polish Zloty (zł)', decimals: 2, position: 'post', group: 'fiat' },
    PYG: { symbol: '₲', name: 'PYG - Paraguayan Guarani (₲)', decimals: 0, position: 'pre', group: 'fiat' },
    QAR: { symbol: 'QR', name: 'QAR - Qatari Riyal (QR)', decimals: 2, position: 'post', group: 'fiat' },
    RON: { symbol: 'lei', name: 'RON - Romanian Leu (lei)', decimals: 2, position: 'post', group: 'fiat' },
    RSD: { symbol: 'din', name: 'RSD - Serbian Dinar (din)', decimals: 2, position: 'post', group: 'fiat' },
    RUB: { symbol: '₽', name: 'RUB - Russian Ruble (₽)', decimals: 2, position: 'post', group: 'fiat' },
    RWF: { symbol: 'RF', name: 'RWF - Rwandan Franc (RF)', decimals: 0, position: 'post', group: 'fiat' },
    SBD: { symbol: 'SI$', name: 'SBD - Solomon Islands Dollar (SI$)', decimals: 2, position: 'pre', group: 'fiat' },
    SCR: { symbol: 'SR', name: 'SCR - Seychellois Rupee (SR)', decimals: 2, position: 'pre', group: 'fiat' },
    SDG: { symbol: 'SDG', name: 'SDG - Sudanese Pound (SDG)', decimals: 2, position: 'post', group: 'fiat' },
    SEK: { symbol: 'kr', name: 'SEK - Swedish Krona (kr)', decimals: 2, position: 'post', group: 'fiat' },
    SHP: { symbol: '£', name: 'SHP - Saint Helena Pound (£)', decimals: 2, position: 'pre', group: 'fiat' },
    SLE: { symbol: 'Le', name: 'SLE - Sierra Leonean Leone (Le)', decimals: 2, position: 'pre', group: 'fiat' },
    SOS: { symbol: 'S', name: 'SOS - Somali Shilling (S)', decimals: 2, position: 'post', group: 'fiat' },
    SRD: { symbol: '$', name: 'SRD - Surinamese Dollar ($)', decimals: 2, position: 'pre', group: 'fiat' },
    SSP: { symbol: '£', name: 'SSP - South Sudanese Pound (£)', decimals: 2, position: 'pre', group: 'fiat' },
    STN: { symbol: 'Db', name: 'STN - São Tomé & Príncipe Dobra (Db)', decimals: 2, position: 'post', group: 'fiat' },
    SYP: { symbol: 'LS', name: 'SYP - Syrian Pound (LS)', decimals: 2, position: 'post', group: 'fiat' },
    SZL: { symbol: 'E', name: 'SZL - Swazi Lilangeni (E)', decimals: 2, position: 'pre', group: 'fiat' },
    THB: { symbol: '฿', name: 'THB - Thai Baht (฿)', decimals: 2, position: 'pre', group: 'fiat' },
    TJS: { symbol: 'SM', name: 'TJS - Tajikistani Somoni (SM)', decimals: 2, position: 'post', group: 'fiat' },
    TMT: { symbol: 'T', name: 'TMT - Turkmenistani Manat (T)', decimals: 2, position: 'post', group: 'fiat' },
    TND: { symbol: 'DT', name: 'TND - Tunisian Dinar (DT)', decimals: 3, position: 'post', group: 'fiat' },
    TOP: { symbol: 'T$', name: 'TOP - Tongan Paʻanga (T$)', decimals: 2, position: 'pre', group: 'fiat' },
    TRY: { symbol: '₺', name: 'TRY - Turkish Lira (₺)', decimals: 2, position: 'pre', group: 'fiat' },
    TTD: { symbol: 'TT$', name: 'TTD - Trinidad & Tobago Dollar (TT$)', decimals: 2, position: 'pre', group: 'fiat' },
    TWD: { symbol: 'NT$', name: 'TWD - New Taiwan Dollar (NT$)', decimals: 2, position: 'pre', group: 'fiat' },
    TZS: { symbol: 'TSh', name: 'TZS - Tanzanian Shilling (TSh)', decimals: 2, position: 'pre', group: 'fiat' },
    UAH: { symbol: '₴', name: 'UAH - Ukrainian Hryvnia (₴)', decimals: 2, position: 'pre', group: 'fiat' },
    UGX: { symbol: 'USh', name: 'UGX - Ugandan Shilling (USh)', decimals: 0, position: 'post', group: 'fiat' },
    UYU: { symbol: '$U', name: 'UYU - Uruguayan Peso ($U)', decimals: 2, position: 'pre', group: 'fiat' },
    UZS: { symbol: "so'm", name: "UZS - Uzbekistani Som (so'm)", decimals: 2, position: 'post', group: 'fiat' },
    VES: { symbol: 'Bs.', name: 'VES - Venezuelan Bolívar (Bs.)', decimals: 2, position: 'pre', group: 'fiat' },
    VND: { symbol: '₫', name: 'VND - Vietnamese Dong (₫)', decimals: 0, position: 'post', group: 'fiat' },
    VUV: { symbol: 'VT', name: 'VUV - Vanuatu Vatu (VT)', decimals: 0, position: 'post', group: 'fiat' },
    WST: { symbol: 'WS$', name: 'WST - Samoan Tala (WS$)', decimals: 2, position: 'pre', group: 'fiat' },
    XAF: { symbol: 'FCFA', name: 'XAF - Central African CFA Franc (FCFA)', decimals: 0, position: 'post', group: 'fiat' },
    XCD: { symbol: 'EC$', name: 'XCD - East Caribbean Dollar (EC$)', decimals: 2, position: 'pre', group: 'fiat' },
    XOF: { symbol: 'CFA', name: 'XOF - West African CFA Franc (CFA)', decimals: 0, position: 'post', group: 'fiat' },
    XPF: { symbol: '₣', name: 'XPF - CFP Franc (₣)', decimals: 0, position: 'post', group: 'fiat' },
    YER: { symbol: 'YR', name: 'YER - Yemeni Rial (YR)', decimals: 2, position: 'post', group: 'fiat' },
    ZAR: { symbol: 'R', name: 'ZAR - South African Rand (R)', decimals: 2, position: 'pre', group: 'fiat' },
    ZMW: { symbol: 'ZK', name: 'ZMW - Zambian Kwacha (ZK)', decimals: 2, position: 'pre', group: 'fiat' },
    ZWL: { symbol: 'Z$', name: 'ZWL - Zimbabwean Dollar (Z$)', decimals: 2, position: 'pre', group: 'fiat' },

    // major cryptocurrencies
    BTC: { symbol: '₿', name: 'BTC - Bitcoin (₿)', decimals: 8, position: 'pre', group: 'crypto' },
    ETH: { symbol: 'Ξ', name: 'ETH - Ethereum (Ξ)', decimals: 6, position: 'pre', group: 'crypto' },
    USDT: { symbol: '₮', name: 'USDT - Tether (₮)', decimals: 2, position: 'pre', group: 'crypto' },
    USDC: { symbol: 'USDC', name: 'USDC - USD Coin', decimals: 2, position: 'pre', group: 'crypto' },
    BNB: { symbol: 'BNB', name: 'BNB - Binance Coin (BNB)', decimals: 4, position: 'pre', group: 'crypto' },
    SOL: { symbol: 'SOL', name: 'SOL - Solana (SOL)', decimals: 4, position: 'pre', group: 'crypto' },
    XRP: { symbol: 'XRP', name: 'XRP - Ripple (XRP)', decimals: 4, position: 'pre', group: 'crypto' },
    DOGE: { symbol: 'Ð', name: 'DOGE - Dogecoin (Ð)', decimals: 2, position: 'pre', group: 'crypto' },
    ADA: { symbol: '₳', name: 'ADA - Cardano (₳)', decimals: 4, position: 'pre', group: 'crypto' },
    TRX: { symbol: 'TRX', name: 'TRX - TRON (TRX)', decimals: 2, position: 'pre', group: 'crypto' },
    TON: { symbol: 'TON', name: 'TON - Toncoin (TON)', decimals: 4, position: 'pre', group: 'crypto' },
    AVAX: { symbol: 'AVAX', name: 'AVAX - Avalanche (AVAX)', decimals: 4, position: 'pre', group: 'crypto' },
    POL: { symbol: 'POL', name: 'POL - Polygon (POL)', decimals: 4, position: 'pre', group: 'crypto' },
    LTC: { symbol: 'Ł', name: 'LTC - Litecoin (Ł)', decimals: 4, position: 'pre', group: 'crypto' },
    DOT: { symbol: 'DOT', name: 'DOT - Polkadot (DOT)', decimals: 4, position: 'pre', group: 'crypto' },
    DAI: { symbol: 'DAI', name: 'DAI - Dai Stablecoin (DAI)', decimals: 2, position: 'pre', group: 'crypto' },
    XMR: { symbol: 'ɱ', name: 'XMR - Monero (ɱ)', decimals: 4, position: 'pre', group: 'crypto' },
    SHIB: { symbol: 'SHIB', name: 'SHIB - Shiba Inu (SHIB)', decimals: 2, position: 'pre', group: 'crypto' },
    SATS: { symbol: 'sats', name: 'SATS - Satoshis (sats)', decimals: 0, position: 'post', group: 'crypto' }
  };

  // --- financial precision helpers (integer minor units) ---
  function parseToMinorUnits(val, decimals = 2) {
    if (val == null || val === '') return 0;
    if (typeof val === 'number') {
      if (Number.isInteger(val) && decimals === 0) return val;
      val = val.toFixed(decimals);
    }
    const clean = String(val).trim().replace(/,/g, '');
    if (!clean || isNaN(parseFloat(clean))) return 0;
    const isNegative = clean.startsWith('-');
    const unsigned = isNegative ? clean.slice(1) : clean;
    const parts = unsigned.split('.');
    const whole = parseInt(parts[0] || '0', 10);
    let frac = (parts[1] || '').slice(0, decimals);
    while (frac.length < decimals) frac += '0';
    const fracInt = parseInt(frac || '0', 10);
    const factor = Math.pow(10, decimals);
    const total = whole * factor + fracInt;
    return isNegative ? -total : total;
  }

  function formatMinorUnitsToInput(minorUnits, decimals = 2) {
    if (minorUnits == null || isNaN(minorUnits)) return '0.00';
    const isNegative = minorUnits < 0;
    const abs = Math.abs(Math.round(minorUnits));
    const factor = Math.pow(10, decimals);
    const whole = Math.floor(abs / factor);
    if (decimals === 0) return (isNegative ? '-' : '') + String(whole);
    const frac = String(abs % factor).padStart(decimals, '0');
    return (isNegative ? '-' : '') + `${whole}.${frac}`;
  }

  function formatDisplayCurrency(minorUnits, currencyCode = 'USD', isBengali = false) {
    const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
    const decimals = curr.decimals;
    const isNegative = minorUnits < 0;
    const abs = Math.abs(Math.round(minorUnits || 0));
    const factor = Math.pow(10, decimals);
    const whole = Math.floor(abs / factor);
    const frac = decimals > 0 ? String(abs % factor).padStart(decimals, '0') : '';

    // Standard grouping
    const wholeStr = whole.toLocaleString('en-US');
    const formattedNum = decimals > 0 ? `${wholeStr}.${frac}` : wholeStr;

    if (isBengali) {
      const bnNum = toBengaliNumerals(formattedNum);
      const sign = isNegative ? '-' : '';
      return `${sign}৳ ${bnNum}`;
    }

    const sign = isNegative ? '-' : '';
    if (curr.position === 'post') {
      return `${sign}${formattedNum} ${curr.symbol}`;
    }
    return `${sign}${curr.symbol}${formattedNum}`;
  }

  // --- bengali conversion utilities ---
  const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  function toBengaliNumerals(input) {
    return String(input).replace(/[0-9]/g, (w) => BN_DIGITS[+w]);
  }

  const BN_MONTHS = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  function formatBengaliDate(dateStr, includeTime = false) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return toBengaliNumerals(dateStr);
    const day = toBengaliNumerals(String(d.getDate()).padStart(2, '0'));
    const month = BN_MONTHS[d.getMonth()] || '';
    const year = toBengaliNumerals(d.getFullYear());
    let res = `${day} ${month} ${year}`;
    if (includeTime) {
      let hours = d.getHours();
      const minutes = toBengaliNumerals(String(d.getMinutes()).padStart(2, '0'));
      const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
      hours = hours % 12 || 12;
      res += `, ${toBengaliNumerals(String(hours).padStart(2, '0'))}:${minutes} ${ampm}`;
    }
    return res;
  }

  const BN_WORDS_0_TO_99 = [
    'শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়',
    'দশ', 'এগারো', 'বারো', 'তেরো', 'চোদ্দ', 'পনেরো', 'ষোল', 'সতেরো', 'আঠারো', 'উনিশ',
    'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আঠাশ', 'উনত্রিশ',
    'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'উনচল্লিশ',
    'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'উনপঞ্চাশ',
    'পঞ্চাশ', 'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'উনষাট',
    'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'উনসত্তর',
    'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'উনআশি',
    'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই',
    'নব্বই', 'একানব্বই', 'বায়ানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'
  ];

  function convertBengaliIntegerWords(n) {
    if (n === 0) return 'শূন্য';
    let parts = [];
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const hundred = Math.floor(n / 100);
    const rest = n % 100;

    if (crore > 0) parts.push(convertBengaliIntegerWords(crore) + ' কোটি');
    if (lakh > 0) parts.push(BN_WORDS_0_TO_99[lakh] + ' লাখ');
    if (thousand > 0) parts.push(BN_WORDS_0_TO_99[thousand] + ' হাজার');
    if (hundred > 0) parts.push(BN_WORDS_0_TO_99[hundred] + ' শত');
    if (rest > 0) parts.push(BN_WORDS_0_TO_99[rest]);

    return parts.join(' ');
  }

  function bengaliAmountInWords(minorUnits, decimals = 2) {
    const factor = Math.pow(10, decimals);
    const abs = Math.abs(Math.round(minorUnits || 0));
    const taka = Math.floor(abs / factor);
    const poisha = decimals > 0 ? abs % factor : 0;

    if (taka === 0 && poisha === 0) return 'কথায়: শূন্য টাকা মাত্র।';

    let out = 'কথায়: ';
    if (taka > 0) {
      out += convertBengaliIntegerWords(taka) + ' টাকা';
    }
    if (poisha > 0) {
      if (taka > 0) out += ' এবং ';
      out += (BN_WORDS_0_TO_99[poisha] || poisha) + ' পয়সা';
    }
    return out + ' মাত্র।';
  }

  // --- MFS (Mobile Financial Services) & PSP (Payment Service Providers) lists ---
  const MFS_PROVIDERS = [
    'bKash',
    'Nagad',
    'Rocket',
    'upay',
    'mCash',
    'tap',
    'MYCash',
    'MeghnaPay',
    'Islamic Wallet',
    'FirstCash',
    'OK Wallet',
    'TeleCash',
    'RupaliCash',
    'Lenden'
  ];

  const PSP_PROVIDERS = [
    'Pathao Pay',
    'Pocket',
    'gpay',
    'Mukto Pay',
    'ST Pay',
    'TallyKhata',
    'Sheba Pay',
    'iPay',
    'Dmoney',
    'Cashbaba'
  ];

  const ALL_MFS_PSP_PROVIDERS = [...MFS_PROVIDERS, ...PSP_PROVIDERS];

  // --- presets & sample data generator ---
  const SAMPLE_PRESETS = {
    'stripe-modern': {
      meta: {
        template: 'stripe-modern',
        docType: 'invoice',
        docNumber: 'INV-2026-0042',
        issueDate: '2026-10-01',
        dueDate: '2026-10-15',
        currency: 'USD',
        barcodeSymbology: 'CODE128',
        barcodeValue: '',
        showBarcode: true,
        thermalWidth: '80mm'
      },
      seller: {
        name: 'Stripeflow Cloud Technologies Inc.',
        logoUrl: '',
        address: '548 Market St, Suite 29000\nSan Francisco, CA 94104',
        taxId: 'US-94-3829104',
        email: 'billing@stripeflow.io',
        terminalId: 'TERM: 01',
        cashier: 'System Auto'
      },
      buyer: {
        name: 'OmniGlobal Systems Ltd',
        address: '100 Bishopsgate, Level 18\nLondon EC2N 4AG, United Kingdom',
        taxId: 'GB-992-1840-22',
        email: 'ap@omniglobalsystems.com',
        poNumber: 'PO-2026-7819',
        phone: '+44 20 7946 0912'
      },
      items: [
        {
          id: 'item-1',
          name: 'Distributed GPU Cluster Compute',
          description: 'Tier-4 high availability clusters (32x H100 SXM5 instances, 720 hrs)',
          qty: 1,
          unitPrice: 1850000,
          taxRate: 5.0,
          discount: 100000,
          discountType: 'fixed'
        },
        {
          id: 'item-2',
          name: 'Vector Database Ingestion Pipeline',
          description: 'High throughput embeddings & low-latency nearest neighbor indexing',
          qty: 12,
          unitPrice: 35000,
          taxRate: 5.0,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-3',
          name: 'Dedicated Site Reliability SLA',
          description: '24/7/365 priority enterprise incident escalation with 15-min response guarantee',
          qty: 1,
          unitPrice: 450000,
          taxRate: 0,
          discount: 0,
          discountType: 'fixed'
        }
      ],
      financials: {
        globalDiscount: 50000,
        shipping: 0
      },
      settlement: {
        method: 'TRANSFER',
        mfsProvider: '',
        mfsNumber: '',
        trxId: '',
        amountPaid: 0,
        tendered: 0,
        change: 0,
        authCode: '',
        last4: '',
        bankDetails: 'Bank: Silicon Valley Bank (First Citizens Bank)\nRouting (ABA): 121000358\nAccount: 4099-2810-4820\nSWIFT / BIC: SVBKUS6S\nIBAN: US42SVBK12100035840992810',
        terms: 'Payment is due within 14 days of invoice issue.\nOnline direct settlement link: https://pay.stripeflow.io/inv-2026-0042'
      }
    },

    'thermal-pos': {
      meta: {
        template: 'thermal-pos',
        docType: 'receipt',
        docNumber: 'RCP-89214',
        issueDate: '2026-10-01',
        dueDate: '2026-10-01',
        currency: 'USD',
        barcodeSymbology: 'CODE128',
        barcodeValue: '',
        showBarcode: true,
        thermalWidth: '80mm'
      },
      seller: {
        name: 'BLUE ROAST COFFEE & BAKERY',
        logoUrl: '',
        address: '420 KEARNY ST, SAN FRANCISCO, CA',
        taxId: 'TAX ID: 94-8192014',
        email: 'info@blueroast.cafe',
        terminalId: 'POS-04',
        cashier: 'SARAH M.'
      },
      buyer: {
        name: 'CUSTOMER #104',
        address: '',
        taxId: '',
        email: '',
        poNumber: '',
        phone: ''
      },
      items: [
        {
          id: 'item-1',
          name: 'Double Shot Oat Latte',
          description: 'Single origin Ethiopian Yirgacheffe, extra hot',
          qty: 2,
          unitPrice: 650,
          taxRate: 8.5,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-2',
          name: 'Avocado Sourdough Toast',
          description: 'Poached pasture egg, dukkah seasoning',
          qty: 1,
          unitPrice: 1400,
          taxRate: 8.5,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-3',
          name: 'Matcha Almond Croissant',
          description: 'Fresh morning bake',
          qty: 1,
          unitPrice: 575,
          taxRate: 8.5,
          discount: 100,
          discountType: 'fixed'
        }
      ],
      financials: {
        globalDiscount: 0,
        shipping: 0
      },
      settlement: {
        method: 'CASH',
        mfsProvider: '',
        mfsNumber: '',
        trxId: '',
        amountPaid: 3450,
        tendered: 4000,
        change: 550,
        authCode: 'AUTH: 981240',
        last4: '9012',
        bankDetails: '',
        terms: 'Returns accepted within 7 days with original receipt.'
      }
    },

    'minimal-classic': {
      meta: {
        template: 'minimal-classic',
        docType: 'invoice',
        docNumber: 'DOC-2026-118',
        issueDate: '2026-10-01',
        dueDate: '2026-10-31',
        currency: 'EUR',
        barcodeSymbology: 'DATAMATRIX',
        barcodeValue: '',
        showBarcode: true,
        thermalWidth: '80mm'
      },
      seller: {
        name: 'Arthur Pendelton, Design Engineer',
        logoUrl: '',
        address: 'Wilhelmstraße 44\n10117 Berlin, Germany',
        taxId: 'DE 304 918 201',
        email: 'arthur@pendelton-studio.de',
        terminalId: '',
        cashier: ''
      },
      buyer: {
        name: 'Verlag & Druckhaus Gutenberg GmbH',
        address: 'Große Bleiche 23\n55116 Mainz, Germany',
        taxId: 'DE 112 409 881',
        email: 'rechnungen@gutenberg-druck.de',
        poNumber: 'VDG-8819',
        phone: '+49 6131 9280'
      },
      items: [
        {
          id: 'item-1',
          name: 'Editorial Typography & Grid System',
          description: 'Custom font pairing, optical kerning tables, and print stylesheets',
          qty: 40,
          unitPrice: 12000,
          taxRate: 19.0,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-2',
          name: 'Vector Monogram & Seal Engraving',
          description: 'Scalable vector marks for stationery and letterpress production',
          qty: 1,
          unitPrice: 150000,
          taxRate: 19.0,
          discount: 0,
          discountType: 'fixed'
        }
      ],
      financials: {
        globalDiscount: 0,
        shipping: 0
      },
      settlement: {
        method: 'TRANSFER',
        mfsProvider: '',
        mfsNumber: '',
        trxId: '',
        amountPaid: 0,
        tendered: 0,
        change: 0,
        authCode: '',
        last4: '',
        bankDetails: 'Bank: Deutsche Bank AG Berlin\nIBAN: DE89 1007 0000 0123 4567 89\nBIC: DEUTDEDBBER',
        terms: 'Zahlbar ohne Abzug innerhalb von 30 Tagen ab Rechnungsdatum.'
      }
    },

    'bn-vintage-ledger': {
      meta: {
        template: 'bn-vintage-ledger',
        docType: 'receipt',
        docNumber: 'MEMO-2026-104',
        issueDate: '2026-09-01',
        dueDate: '2026-09-01',
        currency: 'BDT',
        barcodeSymbology: 'QR',
        barcodeValue: 'https://vintage-ledger.example/receipt/MEMO-2026-104',
        showBarcode: true,
        thermalWidth: '80mm'
      },
      seller: {
        name: 'মেসার্স চৌধুরী ব্রাদার্স',
        logoUrl: '',
        address: '১৬২ ইসলামপুর রোড, বাবুবাজার, ঢাকা-১১০০\nফোন: ০১৮১২-৩৪৫৬৭৮, ০১৭৯৮-৭৬৫৪৩২',
        taxId: 'TIN: ১৯৪০২৮১০৪',
        email: 'chowdhury.brothers@example.com',
        terminalId: '',
        cashier: 'কোষাধ্যক্ষ'
      },
      buyer: {
        name: 'আব্দুল করিম পাটোয়ারী',
        address: '২৪/এ জিন্দাবাহার ১ম লেন, কোতোয়ালী, ঢাকা',
        taxId: '',
        email: '',
        poNumber: '',
        phone: '০১৭৫২-০১৯২৮৩'
      },
      items: [
        {
          id: 'item-1',
          name: 'খাঁটি সুতি তাঁতের শাড়ি (টাঙ্গাইল স্পেশাল)',
          description: 'হস্তচালিত তাঁতে তৈরি পার ডুরে ডিজাইন',
          qty: 2,
          unitPrice: 185000,
          taxRate: 0,
          discount: 10000,
          discountType: 'fixed'
        },
        {
          id: 'item-2',
          name: 'রেশম সিল্ক পাঞ্জাবি থান কাপড়',
          description: 'রাজশাহী খাঁটি সিল্ক সুতা',
          qty: 5,
          unitPrice: 42000,
          taxRate: 0,
          discount: 0,
          discountType: 'fixed'
        }
      ],
      financials: {
        globalDiscount: 0,
        shipping: 0
      },
      settlement: {
        method: 'CASH',
        mfsProvider: 'bKash',
        mfsNumber: '',
        trxId: '',
        amountPaid: 570000,
        tendered: 600000,
        change: 30000,
        authCode: '',
        last4: '',
        bankDetails: '',
        terms: 'বিক্রিত মাল ফেরত বা পরিবর্তন হয় না।\nআমাদের সাথে ব্যবসা করার জন্য ধন্যবাদ।'
      },
      vintageBn: {
        invocation: '॥ ৭ ॥',
        showSeal: true,
        sealText: 'পরিশোধিত',
        showSignature: true,
        signatureTitle: 'কোষাধ্যক্ষ',
        showWordsAmount: true
      }
    },

    'mid-century-tractor': {
      meta: {
        template: 'mid-century-tractor',
        docType: 'invoice',
        docNumber: 'INV-79-4081',
        issueDate: '2026-10-01',
        dueDate: '2026-10-31',
        currency: 'USD',
        barcodeSymbology: 'CODE128',
        barcodeValue: '',
        showBarcode: true,
        thermalWidth: '80mm'
      },
      seller: {
        name: 'APEX INDUSTRIAL SUPPLY CORP.',
        logoUrl: '',
        address: '7420 INDUSTRIAL PARKWAY, BLDG 4\nCLEVELAND, OH 44135\nTEL: (216) 555-0198',
        taxId: 'FED ID: 34-1092847',
        email: 'sales@apexindustrialsupply.com',
        terminalId: 'CR-104',
        cashier: 'DISPATCH #04'
      },
      buyer: {
        name: 'MIDWEST MACHINE WORKS & TOOLING',
        address: '1200 COMMERCE BLVD, DOCK 7\nDETROIT, MI 48226',
        taxId: 'TAX EXEMPT: MI-883019',
        email: 'accounts@midwestmachineworks.com',
        poNumber: 'PO-84-9912',
        phone: '(313) 555-3820'
      },
      items: [
        {
          id: 'item-1',
          name: 'HEAVY-DUTY ROLLER BEARINGS #6208-2RS',
          description: 'PRECISION CHROME STEEL, PRE-LUBRICATED',
          qty: 24,
          unitPrice: 3250,
          taxRate: 6.0,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-2',
          name: 'HYDRAULIC PRESSURE SEALS 3/4" NPT',
          description: 'VITON HIGH-TEMP INDUSTRIAL GRADE',
          qty: 50,
          unitPrice: 875,
          taxRate: 6.0,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-3',
          name: 'TUNGSTEN CARBIDE END MILLS 1/2"',
          description: '4-FLUTE TITANIUM NITRIDE COATED',
          qty: 10,
          unitPrice: 6500,
          taxRate: 6.0,
          discount: 2500,
          discountType: 'fixed'
        }
      ],
      financials: {
        globalDiscount: 0,
        shipping: 4500
      },
      settlement: {
        method: 'TRANSFER',
        mfsProvider: '',
        mfsNumber: '',
        trxId: '',
        amountPaid: 0,
        tendered: 0,
        change: 0,
        authCode: '',
        last4: '',
        bankDetails: 'REMIT PAYMENT TO: APEX INDUSTRIAL SUPPLY CORP.\nLOCKBOX 9820, CLEVELAND, OH 44101\nBANK: NATIONAL CITY BANK OF CLEVELAND',
        terms: 'TERMS: NET 30 DAYS FROM INVOICE DATE.\n1.5% MONTHLY FINANCE CHARGE ON OVERDUE BALANCES.\nALL CLAIMS MUST BE MADE WITHIN 10 DAYS OF RECEIPT.'
      }
    },

    'erp-classic-90s': {
      meta: {
        template: 'erp-classic-90s',
        docType: 'invoice',
        docNumber: 'INV-990421',
        issueDate: '2026-10-01',
        dueDate: '2026-10-31',
        currency: 'USD',
        barcodeSymbology: 'CODE128',
        barcodeValue: '',
        showBarcode: true,
        thermalWidth: '80mm'
      },
      seller: {
        name: 'GLOBAL TECH ENTERPRISES, INC.',
        logoUrl: '',
        address: '900 TECHNOLOGY DRIVE, SUITE 400\nSAN JOSE, CA 95110\nTEL: (408) 555-0100  FAX: (408) 555-0101',
        taxId: 'EIN: 77-0941823',
        email: 'ar@globaltechenterprises.com',
        terminalId: 'CORP-01',
        cashier: 'J. MILLER (REP: 402)'
      },
      buyer: {
        name: 'DATANET NETWORKS & SYSTEMS CORP.',
        address: '2500 EXECUTIVE PARKWAY, SUITE 150\nAUSTIN, TX 78738',
        taxId: 'TX-890214-0',
        email: 'accounting@datanetnetworks.com',
        poNumber: 'PO-98-3301',
        phone: '(512) 555-8800'
      },
      items: [
        {
          id: 'item-1',
          name: 'FAST ETHERNET 24-PORT SWITCH (10/100)',
          description: 'MANAGED RACKMOUNT NETWORK SWITCH WITH SNMP',
          qty: 4,
          unitPrice: 48900,
          taxRate: 8.25,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-2',
          name: 'CAT5E UTP PATCH CABLES (50FT BLUE)',
          description: 'MOLDED BOOT RJ-45 CATEGORY 5E BULK PACK',
          qty: 20,
          unitPrice: 1850,
          taxRate: 8.25,
          discount: 0,
          discountType: 'fixed'
        },
        {
          id: 'item-3',
          name: 'ENTERPRISE ROUTER DUAL WAN MODULE',
          description: 'ISDN / T1 FAILOVER INTERFACE CARD',
          qty: 2,
          unitPrice: 75000,
          taxRate: 8.25,
          discount: 5000,
          discountType: 'fixed'
        }
      ],
      financials: {
        globalDiscount: 5000,
        shipping: 8500
      },
      settlement: {
        method: 'TRANSFER',
        mfsProvider: '',
        mfsNumber: '',
        trxId: '',
        amountPaid: 0,
        tendered: 0,
        change: 0,
        authCode: '',
        last4: '',
        bankDetails: 'BANK: WELLS FARGO BANK, N.A.\nROUTING: 121000248\nACCOUNT: 409-182903-12\nLOCKBOX: DEPT 901, SAN FRANCISCO, CA',
        terms: 'PAYMENT TERMS: NET 30 DAYS.\nACCOUNTS PAST DUE OVER 30 DAYS ARE SUBJECT TO A 1.5% PER MONTH LATE CHARGE.'
      }
    },

    'thermal-retail-mushak': {
      meta: {
        template: 'thermal-retail-mushak',
        docType: 'receipt',
        docNumber: 'D0062402020112',
        issueDate: '2024-02-02 11:13',
        dueDate: '2024-02-02',
        currency: 'BDT',
        barcodeSymbology: 'CODE128',
        barcodeValue: 'D0062402020112',
        showBarcode: true,
        thermalWidth: '80mm'
      },
      seller: {
        name: 'SHWAPNO',
        companyName: 'ACI Logistics Limited',
        registeredAddress: '270, Tejgaon I/A, Dhaka-1208',
        outletName: 'D006-Dhaka Malibag Mor Outlet',
        outletAddress: '260/6, Malibag, Dhaka',
        address: 'Registered Address: 270, Tejgaon I/A, Dhaka-1208\nD006-Dhaka Malibag Mor Outlet\n260/6, Malibag, Dhaka',
        taxId: '000005489-0203',
        email: 'info@shwapno.com',
        terminalId: 'D006POS3N',
        cashier: 'ecomd006'
      },
      buyer: {
        name: 'Loyalty Customer',
        address: '',
        taxId: '',
        email: '',
        poNumber: '',
        phone: '01711666697'
      },
      loyalty: {
        enabled: true,
        previousPoints: 461,
        earnedPoints: 8
      },
      items: [
        {
          id: 'item-1',
          name: 'Farm Egg Brown Loose(Pcs)',
          description: '',
          qty: 12,
          unitPrice: 1165,
          taxRate: 0,
          discount: 979,
          discountType: 'fixed'
        },
        {
          id: 'item-2',
          name: 'Indian Spinach (Palong Shak)',
          description: '',
          qty: 2,
          unitPrice: 1200,
          taxRate: 0,
          discount: 168,
          discountType: 'fixed'
        },
        {
          id: 'item-3',
          name: 'New Alu Regular Loose',
          description: '',
          qty: 7,
          unitPrice: 3700,
          taxRate: 0,
          discount: 1813,
          discountType: 'fixed'
        },
        {
          id: 'item-4',
          name: 'Red Amaranth (Lal Shak) PC',
          description: '',
          qty: 1,
          unitPrice: 1200,
          taxRate: 0,
          discount: 84,
          discountType: 'fixed'
        }
      ],
      financials: {
        globalDiscount: 0,
        shipping: 0
      },
      settlement: {
        method: 'TRANSFER',
        mfsProvider: '',
        mfsNumber: '',
        trxId: '',
        amountPaid: 40400,
        tendered: 40400,
        change: 0,
        authCode: '',
        last4: '',
        bankDetails: '',
        terms: '**VAT against this challan is\npayable through central registration\nJoin the DREAM FACTORY at:\nFACEBOOK.COM/GROUPS/SHWAPNOHELP\nThank you for shopping with SHWAPNO\nPlease visit www.shwapno.com for home delivery.\nPurchase of defected item must be exchanged\nby 24 hours with invoice.\nFor any queries, suggestions or complaints,\nplease call 16469 (9:00 AM - 6:00 PM)\n\nPowered by MIS@ACI Limited'
      }
    }
  };

  function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function computeDocumentTotals(state) {
    const curr = CURRENCIES[state.meta.currency] || CURRENCIES.USD || CURRENCIES.BDT;
    let grossSubtotal = 0;
    let itemDiscountsTotal = 0;
    const taxBuckets = {};

    state.items.forEach(item => {
      const qty = Number(item.qty) || 0;
      const unitPrice = Math.round(Number(item.unitPrice) || 0);
      const lineBase = Math.round(qty * unitPrice);

      let lineDisc = 0;
      if (item.discountType === 'percent') {
        const pct = Math.max(0, Number(item.discount) || 0);
        lineDisc = Math.round(lineBase * (pct / 100));
      } else {
        lineDisc = Math.min(lineBase, Math.round(Number(item.discount) || 0));
      }

      const taxable = Math.max(0, lineBase - lineDisc);
      grossSubtotal += lineBase;
      itemDiscountsTotal += lineDisc;

      const rate = Number(item.taxRate) || 0;
      if (rate > 0) {
        const itemTax = Math.round(taxable * (rate / 100));
        const rateKey = rate.toFixed(1);
        taxBuckets[rateKey] = (taxBuckets[rateKey] || 0) + itemTax;
      }
    });

    const globalDiscount = Math.min(Math.max(0, grossSubtotal - itemDiscountsTotal), Math.round(Number(state.financials.globalDiscount) || 0));
    const discountTotal = itemDiscountsTotal + globalDiscount;
    const taxableBase = Math.max(0, grossSubtotal - discountTotal);
    const shipping = Math.max(0, Math.round(Number(state.financials.shipping) || 0));

    let totalTax = 0;
    Object.values(taxBuckets).forEach(t => { totalTax += t; });

    const exactGrandTotal = Math.max(0, taxableBase + totalTax + shipping);
    const netPayable = Math.round(exactGrandTotal / 100) * 100;
    const rounding = netPayable - exactGrandTotal;

    const targetTotal = (state.meta && state.meta.template === 'thermal-retail-mushak') ? netPayable : exactGrandTotal;

    let amountPaid = Math.round(Number(state.settlement.amountPaid) || 0);
    let balanceDue = 0;

    if (state.meta.docType === 'receipt') {
      if (state.settlement.amountPaid !== undefined && state.settlement.amountPaid !== null && state.settlement.amountPaid !== '' && !isNaN(Number(state.settlement.amountPaid))) {
        amountPaid = Math.round(Number(state.settlement.amountPaid) || 0);
      } else {
        amountPaid = targetTotal;
      }
      balanceDue = Math.max(0, targetTotal - amountPaid);
    } else {
      balanceDue = Math.max(0, targetTotal - amountPaid);
    }

    const tendered = Math.round(Number(state.settlement.tendered) || 0);
    const change = tendered > targetTotal ? tendered - targetTotal : 0;

    return {
      subtotal: grossSubtotal,
      grossSubtotal,
      itemDiscountsTotal,
      discountTotal,
      taxableBase,
      taxBuckets,
      totalTax,
      taxTotal: totalTax,
      globalDiscount,
      shipping,
      grandTotal: exactGrandTotal,
      netPayable,
      rounding,
      amountPaid,
      balanceDue,
      tendered,
      change,
      currency: state.meta.currency,
      decimals: curr.decimals
    };
  }

  // --- barcode renderer hook ---
  function updateReceiptBarcode(targetContainer, textValue, symbology, fallbackUrl = '') {
    if (!targetContainer) return;
    targetContainer.innerHTML = '';

    const text = (textValue && String(textValue).trim())
      || (fallbackUrl && String(fallbackUrl).trim())
      || 'DOC-0001';

    if (!window.TextEngine) {
      targetContainer.innerHTML = `<span style="font-family:monospace;font-size:11px;color:#888;">* ${escapeHTML(text)} *</span>`;
      return;
    }

    try {
      let svgMarkup = '';
      if (symbology === 'QR') {
        svgMarkup = window.TextEngine.generate2DCodeSvg(text, 'qr', { border: 1, darkColor: '#000000', lightColor: '#ffffff' });
      } else if (symbology === 'DATAMATRIX') {
        svgMarkup = window.TextEngine.generate2DCodeSvg(text, 'datamatrix', { border: 1, darkColor: '#000000', lightColor: '#ffffff' });
      } else if (symbology === 'EAN13') {
        let numeric = text.replace(/\D/g, '');
        if (numeric.length < 12) numeric = (numeric + '202604062336').slice(0, 12);
        else numeric = numeric.slice(0, 12);
        svgMarkup = window.TextEngine.generateBarcodeSvg(numeric, { format: 'EAN13', width: 1.4, height: 38, displayValue: true, margin: 4 });
      } else {
        // default CODE128
        svgMarkup = window.TextEngine.generateBarcodeSvg(text, { format: 'CODE128', width: 1.4, height: 38, displayValue: true, margin: 4 });
      }

      if (symbology === 'QR' || symbology === 'DATAMATRIX') {
        svgMarkup = svgMarkup.replace(/<\?xml[\s\S]*?\?>/i, '').trim();
        if (!/<svg[^>]*\bwidth=/i.test(svgMarkup)) {
          svgMarkup = svgMarkup.replace('<svg', '<svg width="76" height="76"');
        }
      }

      if (svgMarkup && !svgMarkup.includes('error')) {
        targetContainer.innerHTML = svgMarkup;
      } else {
        targetContainer.innerHTML = `<div style="font-family:monospace;font-size:11px;color:#888;text-align:center;">* ${escapeHTML(text)} *</div>`;
      }
    } catch (err) {
      targetContainer.innerHTML = `<div style="font-family:monospace;font-size:11px;color:#888;text-align:center;">* ${escapeHTML(text)} *</div>`;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- vintage script pairing helper ---
  function renderVintageScript(text) {
    if (!text) return '';
    const escaped = escapeHTML(text);
    // Explicitly wrap any Latin/ASCII letters, numbers, and symbols in Biro Script Plus
    return escaped.replace(/([A-Za-z0-9][A-Za-z0-9\s#\/\-_@.:,']*[A-Za-z0-9]|[A-Za-z0-9])/g, (match) => {
      return `<span class="font-en-biro">${match}</span>`;
    });
  }

  // --- vintage revenue postage stamp & cancellation seal vector SVG generator ---
  function generateVintageRevenueStampSvg(sealText = 'পরিশোধিত', storeName = 'মেসার্স ট্রেডার্স') {
    const cleanSealText = escapeHTML(sealText || 'পরিশোধিত');
    const cleanStoreName = escapeHTML(storeName || 'মেমো');

    return `<svg class="inv-vbn-revenue-stamp-svg" width="180" height="96" viewBox="0 0 180 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="vbn-stamp-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="1" flood-color="#3a3020" flood-opacity="0.18" />
        </filter>
      </defs>

      <!-- 1. GREEN ENGRAVED REVENUE POSTAGE STAMP -->
      <g class="vbn-postage-stamp" transform="translate(4, 18)" filter="url(#vbn-stamp-shadow)">
        <!-- Perforated outer stamp base (cream paper) -->
        <rect x="0" y="0" width="84" height="66" rx="1" fill="#fdfbf5" stroke="#d5ccba" stroke-width="0.8" />
        
        <!-- Scalloped stamp perforation dots along edges -->
        <g fill="#fbf9f4">
          <circle cx="8" cy="0" r="1.8" /><circle cx="16" cy="0" r="1.8" /><circle cx="24" cy="0" r="1.8" />
          <circle cx="32" cy="0" r="1.8" /><circle cx="40" cy="0" r="1.8" /><circle cx="48" cy="0" r="1.8" />
          <circle cx="56" cy="0" r="1.8" /><circle cx="64" cy="0" r="1.8" /><circle cx="72" cy="0" r="1.8" />
          <circle cx="8" cy="66" r="1.8" /><circle cx="16" cy="66" r="1.8" /><circle cx="24" cy="66" r="1.8" />
          <circle cx="32" cy="66" r="1.8" /><circle cx="40" cy="66" r="1.8" /><circle cx="48" cy="66" r="1.8" />
          <circle cx="56" cy="66" r="1.8" /><circle cx="64" cy="66" r="1.8" /><circle cx="72" cy="66" r="1.8" />
          <circle cx="0" cy="9" r="1.8" /><circle cx="0" cy="18" r="1.8" /><circle cx="0" cy="27" r="1.8" />
          <circle cx="0" cy="36" r="1.8" /><circle cx="0" cy="45" r="1.8" /><circle cx="0" cy="54" r="1.8" />
          <circle cx="84" cy="9" r="1.8" /><circle cx="84" cy="18" r="1.8" /><circle cx="84" cy="27" r="1.8" />
          <circle cx="84" cy="36" r="1.8" /><circle cx="84" cy="45" r="1.8" /><circle cx="84" cy="54" r="1.8" />
        </g>

        <!-- Engraved Green Field -->
        <rect x="4" y="4" width="76" height="58" fill="#1e5430" />
        <rect x="6" y="6" width="72" height="54" fill="none" stroke="#e9f3ec" stroke-width="0.8" />
        <rect x="7.5" y="7.5" width="69" height="51" fill="none" stroke="#e9f3ec" stroke-width="0.4" stroke-dasharray="1 1" />

        <!-- Stamp Header Text -->
        <text x="42" y="13" font-family="'Kobiguru', 'Anek Bangla', serif" font-size="5.5" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">বাংলাদেশ ডাক</text>
        <text x="42" y="18" font-family="'Biro Script Plus', sans-serif" font-size="4" fill="#a4d5b2" text-anchor="middle" letter-spacing="0.8">REVENUE</text>

        <!-- Rural Bengal Engraving Vignette (Hut, Trees, Sun, Water) -->
        <g stroke="#ffffff" stroke-width="0.6" stroke-linecap="round" fill="none" opacity="0.9">
          <!-- Horizon & River -->
          <path d="M 12 43 C 25 41, 40 44, 72 42" />
          <path d="M 12 46 C 30 44, 50 47, 72 45" stroke-dasharray="2 1" />
          <path d="M 16 49 C 32 48, 54 50, 68 49" stroke-dasharray="1 1.5" />
          <!-- Rising Sun & Rays -->
          <circle cx="42" cy="31" r="5" stroke="#d5f2dc" stroke-width="0.5" />
          <path d="M 42 23 L 42 25 M 34 26 L 36 28 M 50 26 L 48 28 M 31 31 L 33 31 M 53 31 L 51 31" stroke="#d5f2dc" stroke-width="0.4" />
          <!-- Cottage / কুঁড়েঘর -->
          <path d="M 22 41 L 30 33 L 40 33 L 34 41 Z" fill="#2d6a3f" stroke="#ffffff" stroke-width="0.6" />
          <path d="M 23 41 L 23 46 L 33 46 L 33 41" stroke="#ffffff" stroke-width="0.6" />
          <path d="M 26 43 L 26 46 L 29 46 L 29 43 Z" fill="#143e22" stroke="#ffffff" stroke-width="0.4" />
          <!-- Palm Trees -->
          <path d="M 52 42 Q 51 34 50 28" stroke-width="0.7" />
          <path d="M 50 28 Q 44 26 42 29 M 50 28 Q 47 24 51 22 M 50 28 Q 55 24 58 26 M 50 28 Q 56 30 55 33" stroke-width="0.5" />
          <path d="M 58 42 Q 57 36 56 31" stroke-width="0.6" />
          <path d="M 56 31 Q 52 29 50 31 M 56 31 Q 54 27 57 25 M 56 31 Q 61 27 63 30" stroke-width="0.4" />
        </g>

        <!-- Denomination at corners / bottom -->
        <text x="12" y="56" font-family="'Kobiguru', serif" font-size="6.5" font-weight="bold" fill="#ffffff">১০</text>
        <text x="72" y="56" font-family="'Kobiguru', serif" font-size="6.5" font-weight="bold" fill="#ffffff" text-anchor="end">৳ ১০</text>
      </g>

      <!-- 2. OVERLAPPING RED POSTAL CANCELLATION SEAL WITH WAVY POSTMARK KILLER LINES -->
      <g class="vbn-postal-cancellation" transform="translate(38, 38) rotate(-11)">
        <circle cx="0" cy="0" r="28" stroke="#b71c1c" stroke-width="1.6" fill="none" opacity="0.88" />
        <circle cx="0" cy="0" r="25" stroke="#b71c1c" stroke-width="0.8" stroke-dasharray="2.5 1" fill="none" opacity="0.85" />
        
        <g fill="#b71c1c" opacity="0.9" text-anchor="middle">
          <text x="0" y="-14" font-family="'Kobiguru', serif" font-size="7" font-weight="bold">${cleanStoreName}</text>
          <line x1="-22" y1="-8" x2="22" y2="-8" stroke="#b71c1c" stroke-width="0.8" />
          <text x="0" y="0" font-family="'Kobiguru', serif" font-size="9" font-weight="bold">${cleanSealText}</text>
          <line x1="-22" y1="5" x2="22" y2="5" stroke="#b71c1c" stroke-width="0.8" />
          <text x="0" y="15" font-family="'Biro Script Plus', sans-serif" font-size="5" font-weight="bold">POSTAL CANCELED</text>
        </g>

        <!-- 3 WAVY POSTMARK KILLER LINES EXTENDING RIGHTWARD -->
        <g stroke="#b71c1c" stroke-width="1.2" fill="none" opacity="0.82" stroke-linecap="round">
          <path d="M 28 -7 C 42 -14, 56 0, 70 -7 C 84 -14, 98 0, 112 -7 C 122 -12, 130 -5, 136 -7" />
          <path d="M 28 0 C 42 -7, 56 7, 70 0 C 84 -7, 98 7, 112 0 C 122 -5, 130 2, 136 0" />
          <path d="M 28 7 C 42 0, 56 14, 70 7 C 84 0, 98 14, 112 7 C 122 2, 130 9, 136 7" />
        </g>
      </g>
    </svg>`;
  }

  function computeCleanPageBreaks(paperTarget, domHeight, maxPage1HeightPx, maxPageNHeightPx) {
    const paperRect = paperTarget.getBoundingClientRect();

    const breakSelectors = [
      'tbody tr',
      '.inv-stripe-header',
      '.inv-stripe-entities',
      '.inv-stripe-table-wrap',
      '.inv-stripe-totals-wrap',
      '.inv-stripe-footer',
      '.inv-classic-masthead',
      '.inv-classic-buyer-block',
      '.inv-classic-table',
      '.inv-classic-bottom-grid',
      '.inv-classic-footer-bar',
      '.inv-vbn-masthead',
      '.inv-vbn-meta-box',
      '.inv-vbn-pay-banner',
      '.inv-vbn-table',
      '.inv-vbn-summary-grid',
      '.inv-vbn-divider-bottom',
      '.inv-vbn-bottom-authentic',
      '.inv-mushak-top-auth',
      '.inv-mushak-meta-block',
      '.inv-mushak-table',
      '.inv-mushak-ledger',
      '.inv-mushak-disc-module',
      '.inv-mushak-loyalty-module',
      '.inv-mushak-footer-notes',
      '.receipt-barcode-target'
    ];

    const elements = Array.from(paperTarget.querySelectorAll(breakSelectors.join(', ')));
    const candidateBreakPoints = new Set();

    elements.forEach(el => {
      const r = el.getBoundingClientRect();
      const top = Math.round(r.top - paperRect.top);
      const bottom = Math.round(r.bottom - paperRect.top);
      if (top > 10 && top < domHeight - 10) candidateBreakPoints.add(top);
      if (bottom > 10 && bottom < domHeight - 10) candidateBreakPoints.add(bottom);
    });

    const sortedCandidates = Array.from(candidateBreakPoints).sort((a, b) => a - b);

    const breaks = [0];
    let currentY = 0;
    let pageIndex = 0;

    while (currentY < domHeight) {
      const maxAllowedPx = pageIndex === 0 ? maxPage1HeightPx : maxPageNHeightPx;

      // If remaining height fits comfortably in the current page, finish up
      if (domHeight - currentY <= maxAllowedPx) {
        breaks.push(domHeight);
        break;
      }

      const maxBreakY = currentY + maxAllowedPx;
      const minBreakY = currentY + (maxAllowedPx * 0.45);

      // Look for candidate break positions within [minBreakY, maxBreakY]
      const valid = sortedCandidates.filter(pos => pos > minBreakY && pos <= maxBreakY);

      let chosenBreak = maxBreakY;
      if (valid.length > 0) {
        chosenBreak = valid[valid.length - 1];
      } else {
        // Find any element straddling maxBreakY and break right before it
        const straddling = elements.find(el => {
          const r = el.getBoundingClientRect();
          const top = Math.round(r.top - paperRect.top);
          const bottom = Math.round(r.bottom - paperRect.top);
          return top < maxBreakY && bottom > maxBreakY && top > minBreakY;
        });
        if (straddling) {
          chosenBreak = Math.round(straddling.getBoundingClientRect().top - paperRect.top);
        }
      }

      // Safety guard against zero or negligible progression
      if (chosenBreak <= currentY + 100) {
        chosenBreak = currentY + maxAllowedPx;
      }

      breaks.push(chosenBreak);
      currentY = chosenBreak;
      pageIndex++;
    }

    return breaks;
  }

  // --- invoice generator singleton ---
  const InvoiceGenerator = {
    activeTemplate: 'stripe-modern',
    templateStates: null,
    state: null,
    initialized: false,
    activeTab: 'setup',
    zoom: 0.95,
    storageKey: 'syzarn_invoice_generator_state_v2',
    saveTimer: null,
    previewTimer: null,
    mountEl: null,
    workbench: null,
    computeTotals: computeDocumentTotals,
    presets: SAMPLE_PRESETS,
    SAMPLE_PRESETS: SAMPLE_PRESETS,

    init() {
      if (this.initialized) return;
      this.initialized = true;

      if (!this.templateStates) {
        this.templateStates = {};
      }
      for (const key of Object.keys(SAMPLE_PRESETS)) {
        if (!this.templateStates[key]) {
          this.templateStates[key] = cloneObject(SAMPLE_PRESETS[key]);
        }
      }

      this.activeTemplate = this.activeTemplate || 'stripe-modern';

      const saved = this.loadFromStorage();
      if (saved && saved.templateStates) {
        for (const key of Object.keys(SAMPLE_PRESETS)) {
          if (saved.templateStates[key] && saved.templateStates[key].meta && saved.templateStates[key].items) {
            // Guard against Bengali cross-contamination in non-Bengali templates
            if (key !== 'bn-vintage-ledger') {
              const sellerName = (saved.templateStates[key].seller && saved.templateStates[key].seller.name) || '';
              const hasBengali = /[\u0980-\u09FF]/.test(sellerName);
              if (!hasBengali) {
                this.templateStates[key] = saved.templateStates[key];
              }
            } else {
              this.templateStates[key] = saved.templateStates[key];
            }
          }
        }
        if (saved.activeTemplate && SAMPLE_PRESETS[saved.activeTemplate]) {
          this.activeTemplate = saved.activeTemplate;
        }
      }

      this.state = this.templateStates[this.activeTemplate];
    },

    loadFromStorage() {
      try {
        if (typeof localStorage !== 'undefined' && localStorage.getItem) {
          try {
            localStorage.removeItem('syzarn_invoice_generator_state_v1');
          } catch (_) { }

          const raw = localStorage.getItem(this.storageKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              return parsed;
            }
          }
        }
      } catch (e) {
        console.warn('could not load invoice state from storage', e);
      }
      return null;
    },

    saveToStorage() {
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        try {
          if (typeof localStorage !== 'undefined' && localStorage.setItem) {
            if (this.state && this.activeTemplate) {
              this.templateStates[this.activeTemplate] = cloneObject(this.state);
            }
            const payload = {
              activeTemplate: this.activeTemplate,
              templateStates: this.templateStates
            };
            localStorage.setItem(this.storageKey, JSON.stringify(payload));
          }
        } catch (e) {
          console.warn('localStorage quota exceeded while saving invoice state', e);
        }
      }, 300);
    },

    setTemplate(template) {
      if (!SAMPLE_PRESETS[template]) return;
      this.init();

      if (this.state && this.activeTemplate) {
        this.templateStates[this.activeTemplate] = cloneObject(this.state);
      }

      this.activeTemplate = template;
      if (!this.templateStates[template]) {
        this.templateStates[template] = cloneObject(SAMPLE_PRESETS[template]);
      }
      this.state = this.templateStates[template];
      this.state.meta.template = template;

      if (template !== 'bn-vintage-ledger' && this.activeTab === 'vintage') {
        this.activeTab = 'setup';
      }

      if (template === 'thermal-pos' || template === 'thermal-retail-mushak') {
        this.state.meta.barcodeSymbology = this.state.meta.barcodeSymbology || 'CODE128';
      }

      this.saveToStorage();
      this.render();
    },

    setDocType(docType) {
      this.init();
      if (this.state && this.state.meta) {
        this.state.meta.docType = docType;
      }
      if (this.activeTemplate && this.templateStates && this.templateStates[this.activeTemplate]) {
        this.templateStates[this.activeTemplate].meta.docType = docType;
      }
      this.saveToStorage();
      this.render();
    },

    setDocNumber(docNumber) {
      this.init();
      if (this.state && this.state.meta) {
        this.state.meta.docNumber = docNumber;
      }
      if (this.activeTemplate && this.templateStates && this.templateStates[this.activeTemplate]) {
        this.templateStates[this.activeTemplate].meta.docNumber = docNumber;
      }
      this.saveToStorage();
      this.render();
    },

    loadSample(templateName) {
      this.init();
      const t = templateName || this.activeTemplate || (this.state && this.state.meta && this.state.meta.template) || 'stripe-modern';
      if (SAMPLE_PRESETS[t]) {
        this.templateStates[t] = cloneObject(SAMPLE_PRESETS[t]);
        if (t === this.activeTemplate) {
          this.state = this.templateStates[t];
        }
        this.saveToStorage();
        this.render();
      }
    },

    reset() {
      this.init();
      const t = this.activeTemplate || 'stripe-modern';
      if (confirm(`reset ${t} fields to sample defaults? this cannot be undone.`)) {
        this.templateStates[t] = cloneObject(SAMPLE_PRESETS[t]);
        this.state = this.templateStates[t];
        this.saveToStorage();
        this.render();
      }
    },

    mount(container, workbench) {
      this.mountEl = container;
      this.workbench = workbench;
      this.init();
      this.render();
    },

    render() {
      if (!this.mountEl) return;
      this.renderWorkspaceStructure();
      this.renderFormContent();
      this.renderLivePreview();
    },

    renderWorkspaceStructure() {
      if (this.mountEl.querySelector('#inv-workspace-root')) return;

      this.mountEl.innerHTML = `
        <div id="inv-workspace-root" class="inv-workspace">
          <!-- Top Utility & Mode Bar -->
          <div class="inv-topbar">
            <div class="inv-topbar-left">
              <span class="inv-tool-label">invoice & receipt generator</span>
              <span class="inv-badge" id="inv-doc-mode-badge">${escapeHTML(this.state.meta.template)} • ${escapeHTML(this.state.meta.docType)}</span>
            </div>
            <div class="inv-topbar-right">
              <button type="button" class="tm-btn" id="inv-textbox-toggle-btn" title="toggle text box display">expand text box</button>
              <button type="button" class="tm-btn" id="inv-sample-btn" title="load template-tailored sample data">load sample</button>
              <button type="button" class="tm-btn" id="inv-reset-btn" title="reset form to clean template">reset form</button>
              <button type="button" class="tm-btn" id="inv-print-btn" title="open browser print dialog">print</button>
              <button type="button" class="tm-btn tm-btn-primary" id="inv-pdf-btn" title="download authentic vector PDF file directly">download PDF</button>
            </div>
          </div>

          <!-- Split Screen: Form (Left) & Live Canvas (Right) -->
          <div class="inv-split-body">
            <!-- Left Form Panel -->
            <div class="inv-editor-pane" id="inv-editor-pane">
              <!-- Segmented Navigation Tabs -->
              <div class="inv-nav-tabs" id="inv-nav-tabs">
                <button type="button" class="inv-tab-btn active" data-tab="setup">setup</button>
                <button type="button" class="inv-tab-btn" data-tab="seller">seller</button>
                <button type="button" class="inv-tab-btn" data-tab="buyer">buyer</button>
                <button type="button" class="inv-tab-btn" data-tab="items">items (<span id="inv-items-count">${this.state.items.length}</span>)</button>
                <button type="button" class="inv-tab-btn" data-tab="financials">financials</button>
                <button type="button" class="inv-tab-btn" data-tab="settlement">settlement</button>
                <button type="button" class="inv-tab-btn" data-tab="vintage" id="inv-tab-btn-vintage" style="${this.state.meta.template === 'bn-vintage-ledger' ? '' : 'display:none;'}">ledger options</button>
              </div>

              <!-- Tab Form Container -->
              <div class="inv-tab-content" id="inv-tab-content"></div>
            </div>

            <!-- Right Live Preview Canvas -->
            <div class="inv-preview-pane" id="inv-preview-pane">
              <!-- Canvas Zoom & Control Bar -->
              <div class="inv-canvas-toolbar">
                <div class="inv-zoom-group">
                  <span class="c-dim">zoom:</span>
                  <button type="button" class="tm-btn tm-btn-xs" id="inv-zoom-out" title="zoom out">-</button>
                  <span class="inv-zoom-display" id="inv-zoom-display">95%</span>
                  <button type="button" class="tm-btn tm-btn-xs" id="inv-zoom-in" title="zoom in">+</button>
                  <button type="button" class="tm-btn tm-btn-xs" id="inv-zoom-fit" title="fit document to viewport">fit</button>
                  <button type="button" class="tm-btn tm-btn-xs" id="inv-zoom-reset" title="reset zoom to 100%">100%</button>
                </div>
                <div class="inv-meta-group">
                  <span class="c-dim" id="inv-preview-geo">A4 / letter (vector)</span>
                </div>
              </div>

              <!-- Document Viewport -->
              <div class="inv-canvas-viewport" id="inv-canvas-viewport">
                <div class="inv-canvas-scaler" id="inv-canvas-scaler">
                  <div class="inv-paper" id="inv-paper-target"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire topbar buttons
      const pdfBtn = document.getElementById('inv-pdf-btn');
      if (pdfBtn) pdfBtn.addEventListener('click', () => this.downloadPdf());

      const printBtn = document.getElementById('inv-print-btn');
      if (printBtn) printBtn.addEventListener('click', () => this.print());

      const sampleBtn = document.getElementById('inv-sample-btn');
      if (sampleBtn) sampleBtn.addEventListener('click', () => this.loadSample());

      const resetBtn = document.getElementById('inv-reset-btn');
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

      const toggleTbBtn = document.getElementById('inv-textbox-toggle-btn');
      if (toggleTbBtn) {
        toggleTbBtn.addEventListener('click', () => {
          const win = document.querySelector('.tm-window');
          if (!win) return;
          const isForced = win.classList.toggle('tm-editor-forced-open');
          toggleTbBtn.textContent = isForced ? 'collapse text box' : 'expand text box';
        });
      }

      // Wire tabs
      const tabsWrap = document.getElementById('inv-nav-tabs');
      if (tabsWrap) {
        tabsWrap.addEventListener('click', (e) => {
          const btn = e.target.closest('.inv-tab-btn');
          if (!btn) return;
          const tab = btn.dataset.tab;
          this.activeTab = tab;
          tabsWrap.querySelectorAll('.inv-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
          this.renderFormContent();
        });
      }

      // Wire zoom buttons
      const zoomIn = document.getElementById('inv-zoom-in');
      const zoomOut = document.getElementById('inv-zoom-out');
      const zoomReset = document.getElementById('inv-zoom-reset');
      const zoomFit = document.getElementById('inv-zoom-fit');

      if (zoomIn) zoomIn.addEventListener('click', () => this.setZoom(this.zoom + 0.1));
      if (zoomOut) zoomOut.addEventListener('click', () => this.setZoom(Math.max(0.3, this.zoom - 0.1)));
      if (zoomReset) zoomReset.addEventListener('click', () => this.setZoom(1.0));
      if (zoomFit) zoomFit.addEventListener('click', () => this.fitZoom());
    },

    setZoom(val) {
      this.zoom = Math.round(val * 100) / 100;
      const display = document.getElementById('inv-zoom-display');
      if (display) display.textContent = `${Math.round(this.zoom * 100)}%`;
      const scaler = document.getElementById('inv-canvas-scaler');
      if (scaler) {
        scaler.style.transform = `scale(${this.zoom})`;
      }
    },

    fitZoom() {
      const viewport = document.getElementById('inv-canvas-viewport');
      const paper = document.getElementById('inv-paper-target');
      if (!viewport || !paper) return;

      const availWidth = viewport.clientWidth - 48;
      const paperWidth = paper.offsetWidth || 794;
      if (paperWidth > 0 && availWidth > 0) {
        const newZoom = Math.min(1.2, Math.max(0.35, availWidth / paperWidth));
        this.setZoom(newZoom);
      }
    },

    renderFormContent() {
      const container = document.getElementById('inv-tab-content');
      if (!container) return;

      const badge = document.getElementById('inv-doc-mode-badge');
      if (badge) {
        badge.textContent = `${this.state.meta.template} • ${this.state.meta.docType}`;
      }

      const vintageTabBtn = document.getElementById('inv-tab-btn-vintage');
      if (vintageTabBtn) {
        vintageTabBtn.style.display = this.state.meta.template === 'bn-vintage-ledger' ? 'inline-block' : 'none';
      }

      const itemsBadge = document.getElementById('inv-items-count');
      if (itemsBadge) itemsBadge.textContent = this.state.items.length;

      let html = '';
      switch (this.activeTab) {
        case 'setup':
          html = this.getSetupTabHtml();
          break;
        case 'seller':
          html = this.getSellerTabHtml();
          break;
        case 'buyer':
          html = this.getBuyerTabHtml();
          break;
        case 'items':
          html = this.getItemsTabHtml();
          break;
        case 'financials':
          html = this.getFinancialsTabHtml();
          break;
        case 'settlement':
          html = this.getSettlementTabHtml();
          break;
        case 'vintage':
          html = this.getVintageTabHtml();
          break;
        default:
          html = this.getSetupTabHtml();
      }

      container.innerHTML = html;
      this.attachFormEvents(container);
    },

    getSetupTabHtml() {
      const m = this.state.meta;
      const isThermal = m.template === 'thermal-pos' || m.template === 'thermal-retail-mushak';

      return `
        <div class="inv-form-section">
          <div class="inv-section-title">document setup</div>

          <div class="inv-field-row">
            <label class="inv-label" for="meta-template">template:</label>
            <select class="tm-select inv-control" id="meta-template">
              <option value="stripe-modern" ${m.template === 'stripe-modern' ? 'selected' : ''}>modern digital (stripe-style)</option>
              <option value="thermal-pos" ${m.template === 'thermal-pos' ? 'selected' : ''}>thermal pos (continuous roll)</option>
              <option value="minimal-classic" ${m.template === 'minimal-classic' ? 'selected' : ''}>minimal classic (freelancer / contractor)</option>
              <option value="bn-vintage-ledger" ${m.template === 'bn-vintage-ledger' ? 'selected' : ''}>vintage bengali ledger (হালখাতা / ক্যাশ মেমো)</option>
              <option value="mid-century-tractor" ${m.template === 'mid-century-tractor' ? 'selected' : ''}>continuous tractor-feed (dot-matrix 1970s/80s)</option>
              <option value="erp-classic-90s" ${m.template === 'erp-classic-90s' ? 'selected' : ''}>enterprise erp (late-90s corporate / quickbooks)</option>
              <option value="thermal-retail-mushak" ${m.template === 'thermal-retail-mushak' ? 'selected' : ''}>supermarket challan (NBR Mushak-6.3 thermal)</option>
            </select>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="meta-doctype">document type:</label>
            <select class="tm-select inv-control" id="meta-doctype">
              <option value="invoice" ${m.docType === 'invoice' ? 'selected' : ''}>invoice</option>
              <option value="receipt" ${m.docType === 'receipt' ? 'selected' : ''}>receipt</option>
              <option value="tax-invoice" ${m.docType === 'tax-invoice' ? 'selected' : ''}>tax invoice</option>
              <option value="pro-forma" ${m.docType === 'pro-forma' ? 'selected' : ''}>pro forma</option>
            </select>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="meta-docnumber">document no.:</label>
            <input type="text" class="tm-input inv-control" id="meta-docnumber" value="${escapeHTML(m.docNumber)}" placeholder="e.g. INV-2026-001">
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="meta-issuedate">issue date:</label>
            <input type="date" class="tm-input inv-control" id="meta-issuedate" value="${escapeHTML(m.issueDate)}">
          </div>

          ${!isThermal && m.docType !== 'receipt' ? `
            <div class="inv-field-row">
              <label class="inv-label" for="meta-duedate">due date:</label>
              <input type="date" class="tm-input inv-control" id="meta-duedate" value="${escapeHTML(m.dueDate || '')}">
            </div>
          ` : ''}

          <div class="inv-field-row">
            <label class="inv-label" for="meta-currency">currency:</label>
            <select class="tm-select inv-control" id="meta-currency">
              <optgroup label="popular &amp; regional">
                ${Object.keys(CURRENCIES).filter(code => CURRENCIES[code].group === 'popular').map(code => `
                  <option value="${code}" ${(m.currency || 'USD') === code ? 'selected' : ''}>${escapeHTML(CURRENCIES[code].name)}</option>
                `).join('')}
              </optgroup>
              <optgroup label="fiat currencies (a-z)">
                ${Object.keys(CURRENCIES).filter(code => CURRENCIES[code].group === 'fiat').map(code => `
                  <option value="${code}" ${m.currency === code ? 'selected' : ''}>${escapeHTML(CURRENCIES[code].name)}</option>
                `).join('')}
              </optgroup>
              <optgroup label="cryptocurrencies">
                ${Object.keys(CURRENCIES).filter(code => CURRENCIES[code].group === 'crypto').map(code => `
                  <option value="${code}" ${m.currency === code ? 'selected' : ''}>${escapeHTML(CURRENCIES[code].name)}</option>
                `).join('')}
              </optgroup>
            </select>
          </div>

          <div class="inv-field-row">
            <label class="tm-checkbox-label">
              <input type="checkbox" id="meta-showbarcode" ${m.showBarcode !== false ? 'checked' : ''}>
              display barcode / QR code on document
            </label>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="meta-symbology">barcode symbology:</label>
            <select class="tm-select inv-control" id="meta-symbology">
              <option value="CODE128" ${m.barcodeSymbology === 'CODE128' ? 'selected' : ''}>Code 128 (universal linear receipt / order)</option>
              <option value="QR" ${m.barcodeSymbology === 'QR' ? 'selected' : ''}>QR Code (payment link &amp; e-invoicing)</option>
              <option value="DATAMATRIX" ${m.barcodeSymbology === 'DATAMATRIX' ? 'selected' : ''}>Data Matrix (compact B2B enterprise)</option>
              <option value="EAN13" ${m.barcodeSymbology === 'EAN13' ? 'selected' : ''}>EAN-13 / UPC-A (retail SKU / lookup)</option>
            </select>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="meta-barcodevalue">barcode / QR data:</label>
            <input type="text" class="tm-input inv-control" id="meta-barcodevalue" value="${escapeHTML(m.barcodeValue || '')}" placeholder="leave empty to auto-use document no. or URL">
          </div>

          ${isThermal ? `
            <div class="inv-field-row">
              <label class="inv-label" for="meta-thermalwidth">roll width:</label>
              <select class="tm-select inv-control" id="meta-thermalwidth">
                <option value="80mm" ${m.thermalWidth === '80mm' ? 'selected' : ''}>80mm (standard receipt)</option>
                <option value="58mm" ${m.thermalWidth === '58mm' ? 'selected' : ''}>58mm (compact mobile roll)</option>
              </select>
            </div>
          ` : ''}
        </div>
      `;
    },

    getSellerTabHtml() {
      const s = this.state.seller;
      const isMushak = this.state.meta.template === 'thermal-retail-mushak';
      const isThermal = this.state.meta.template === 'thermal-pos' || isMushak;

      return `
        <div class="inv-form-section">
          <div class="inv-section-title">seller / issuer details</div>

          ${isMushak ? `
            <div class="inv-field-row">
              <label class="inv-label" for="seller-name">brand name:</label>
              <input type="text" class="tm-input inv-control" id="seller-name" value="${escapeHTML(s.name || 'SHWAPNO')}" placeholder="e.g. SHWAPNO">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-company">corporate entity:</label>
              <input type="text" class="tm-input inv-control" id="seller-company" value="${escapeHTML(s.companyName || 'ACI Logistics Limited')}" placeholder="e.g. ACI Logistics Limited">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-regaddress">registered HQ address:</label>
              <textarea class="tm-input inv-control" id="seller-regaddress" rows="2" placeholder="e.g. 270, Tejgaon I/A, Dhaka-1208">${escapeHTML(s.registeredAddress || '270, Tejgaon I/A, Dhaka-1208')}</textarea>
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-taxid">central VAT reg. no.:</label>
              <input type="text" class="tm-input inv-control" id="seller-taxid" value="${escapeHTML(s.taxId || '000005489-0203')}" placeholder="e.g. 000005489-0203">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-outletname">outlet name:</label>
              <input type="text" class="tm-input inv-control" id="seller-outletname" value="${escapeHTML(s.outletName || 'D006-Dhaka Malibag Mor Outlet')}" placeholder="e.g. D006-Dhaka Malibag Mor Outlet">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-outletaddress">outlet address:</label>
              <input type="text" class="tm-input inv-control" id="seller-outletaddress" value="${escapeHTML(s.outletAddress || '260/6, Malibag, Dhaka')}" placeholder="e.g. 260/6, Malibag, Dhaka">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-cashier">cashier ID:</label>
              <input type="text" class="tm-input inv-control" id="seller-cashier" value="${escapeHTML(s.cashier || '18821')}" placeholder="e.g. 18821 or ecomd006">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-terminal">terminal ID:</label>
              <input type="text" class="tm-input inv-control" id="seller-terminal" value="${escapeHTML(s.terminalId || 'D094POS1N')}" placeholder="e.g. D094POS1N">
            </div>
          ` : `
            <div class="inv-field-row">
              <label class="inv-label" for="seller-name">business name:</label>
              <input type="text" class="tm-input inv-control" id="seller-name" value="${escapeHTML(s.name)}" placeholder="e.g. Acme Corporation">
            </div>

            <!-- Logo Dropzone -->
            <div class="inv-field-row" style="align-items: flex-start;">
              <label class="inv-label">logo image:</label>
              <div class="inv-logo-zone" id="inv-logo-zone">
                ${s.logoUrl ? `
                  <div class="inv-logo-preview-wrap">
                    <img src="${s.logoUrl}" class="inv-logo-preview-img" alt="logo preview">
                    <button type="button" class="tm-btn tm-btn-xs" id="inv-remove-logo-btn">remove logo</button>
                  </div>
                ` : `
                  <div class="inv-logo-drop-prompt">
                    <span>drag & drop logo image, or <span class="c-accent">browse</span></span>
                    <span class="c-dim" style="font-size:0.7rem;">PNG, JPEG, SVG, WebP (client-side base64)</span>
                  </div>
                `}
                <input type="file" id="inv-logo-file-input" accept="image/png, image/jpeg, image/svg+xml, image/webp" style="display:none;">
              </div>
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-address">address:</label>
              <textarea class="tm-input inv-control" id="seller-address" rows="3" placeholder="street, city, postal code">${escapeHTML(s.address)}</textarea>
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-taxid">tax ID / VAT:</label>
              <input type="text" class="tm-input inv-control" id="seller-taxid" value="${escapeHTML(s.taxId || '')}" placeholder="e.g. VAT: GB-123456789">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="seller-email">email / contact:</label>
              <input type="text" class="tm-input inv-control" id="seller-email" value="${escapeHTML(s.email || '')}" placeholder="e.g. billing@company.com">
            </div>

            ${isThermal ? `
              <div class="inv-field-row">
                <label class="inv-label" for="seller-terminal">terminal ID:</label>
                <input type="text" class="tm-input inv-control" id="seller-terminal" value="${escapeHTML(s.terminalId || 'TERM: 01')}" placeholder="e.g. TERM: 01">
              </div>
              <div class="inv-field-row">
                <label class="inv-label" for="seller-cashier">cashier name:</label>
                <input type="text" class="tm-input inv-control" id="seller-cashier" value="${escapeHTML(s.cashier || 'Jane D.')}" placeholder="e.g. Jane D.">
              </div>
            ` : ''}
          `}
        </div>
      `;
    },

    getBuyerTabHtml() {
      const b = this.state.buyer;
      const isMushak = this.state.meta.template === 'thermal-retail-mushak';
      const isThermal = this.state.meta.template === 'thermal-pos' || isMushak;
      const loy = this.state.loyalty || { enabled: true, previousPoints: 0, earnedPoints: 0 };

      return `
        <div class="inv-form-section">
          <div class="inv-section-title">buyer / client details</div>

          ${isMushak ? `
            <div class="inv-field-row">
              <label class="inv-label" for="buyer-phone">customer ID / mobile:</label>
              <input type="text" class="tm-input inv-control" id="buyer-phone" value="${escapeHTML(b.phone || '')}" placeholder="e.g. 01711666697">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="buyer-name">customer category / name:</label>
              <input type="text" class="tm-input inv-control" id="buyer-name" value="${escapeHTML(b.name || 'Loyalty Customer')}" placeholder="e.g. Loyalty Customer">
            </div>

            <div class="inv-section-title" style="margin-top:14px;">loyalty points tracking</div>

            <div class="inv-field-row">
              <label class="tm-checkbox-label">
                <input type="checkbox" id="loyalty-enabled" ${loy.enabled !== false ? 'checked' : ''}>
                print loyalty points ledger on receipt
              </label>
            </div>

            <div class="inv-field-grid-3">
              <div>
                <label class="inv-sublabel">previous points:</label>
                <input type="number" step="1" min="0" class="tm-input inv-control" id="loyalty-prev" value="${loy.previousPoints || 0}">
              </div>
              <div>
                <label class="inv-sublabel">this invoice points:</label>
                <input type="number" step="1" min="0" class="tm-input inv-control" id="loyalty-earned" value="${loy.earnedPoints || 0}">
              </div>
              <div>
                <label class="inv-sublabel">balance points:</label>
                <input type="text" class="tm-input inv-control" disabled value="${(Number(loy.previousPoints) || 0) + (Number(loy.earnedPoints) || 0)}" style="opacity:0.8;">
              </div>
            </div>
          ` : `
            <div class="inv-field-row">
              <label class="inv-label" for="buyer-name">client name:</label>
              <input type="text" class="tm-input inv-control" id="buyer-name" value="${escapeHTML(b.name)}" placeholder="e.g. Globex Corp">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="buyer-address">address:</label>
              <textarea class="tm-input inv-control" id="buyer-address" rows="3" placeholder="client billing address">${escapeHTML(b.address || '')}</textarea>
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="buyer-taxid">tax ID / VAT:</label>
              <input type="text" class="tm-input inv-control" id="buyer-taxid" value="${escapeHTML(b.taxId || '')}" placeholder="client tax ID (optional)">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="buyer-email">email:</label>
              <input type="text" class="tm-input inv-control" id="buyer-email" value="${escapeHTML(b.email || '')}" placeholder="ap@client.com">
            </div>

            ${!isThermal ? `
              <div class="inv-field-row">
                <label class="inv-label" for="buyer-ponumber">PO number:</label>
                <input type="text" class="tm-input inv-control" id="buyer-ponumber" value="${escapeHTML(b.poNumber || '')}" placeholder="e.g. PO-8921">
              </div>
            ` : ''}

            <div class="inv-field-row">
              <label class="inv-label" for="buyer-phone">contact / mobile:</label>
              <input type="text" class="tm-input inv-control" id="buyer-phone" value="${escapeHTML(b.phone || '')}" placeholder="phone or mobile number">
            </div>
          `}
        </div>
      `;
    },

    getItemsTabHtml() {
      const items = this.state.items;
      const curr = CURRENCIES[this.state.meta.currency] || CURRENCIES.USD;
      const decimals = curr.decimals;

      let itemsRows = items.map((item, idx) => {
        const unitPriceStr = formatMinorUnitsToInput(item.unitPrice, decimals);
        const discountStr = formatMinorUnitsToInput(item.discount || 0, decimals);

        return `
          <div class="inv-item-card" data-idx="${idx}">
            <div class="inv-item-header">
              <span class="inv-item-number">#${idx + 1}</span>
              <div class="inv-item-actions">
                <button type="button" class="tm-btn tm-btn-xs inv-item-up" data-idx="${idx}" title="move up" ${idx === 0 ? 'disabled' : ''}>↑</button>
                <button type="button" class="tm-btn tm-btn-xs inv-item-down" data-idx="${idx}" title="move down" ${idx === items.length - 1 ? 'disabled' : ''}>↓</button>
                <button type="button" class="tm-btn tm-btn-xs inv-item-del" data-idx="${idx}" title="delete item">✕</button>
              </div>
            </div>

            <div class="inv-field-row">
              <label class="inv-label">item name:</label>
              <input type="text" class="tm-input inv-control inv-item-input" data-field="name" data-idx="${idx}" value="${escapeHTML(item.name)}" placeholder="item description">
            </div>

            <div class="inv-field-row">
              <label class="inv-label">notes / details:</label>
              <input type="text" class="tm-input inv-control inv-item-input" data-field="description" data-idx="${idx}" value="${escapeHTML(item.description || '')}" placeholder="additional description (optional)">
            </div>

            <div class="inv-field-grid-3">
              <div>
                <label class="inv-sublabel">qty:</label>
                <input type="number" step="any" min="0" class="tm-input inv-control inv-item-input" data-field="qty" data-idx="${idx}" value="${item.qty}">
              </div>
              <div>
                <label class="inv-sublabel">unit price (${curr.symbol}):</label>
                <input type="number" step="any" min="0" class="tm-input inv-control inv-item-input" data-field="unitPrice" data-idx="${idx}" value="${unitPriceStr}">
              </div>
              <div>
                <label class="inv-sublabel">tax rate %:</label>
                <input type="number" step="any" min="0" class="tm-input inv-control inv-item-input" data-field="taxRate" data-idx="${idx}" value="${item.taxRate || 0}">
              </div>
            </div>

            <div class="inv-field-row" style="margin-top:6px;">
              <label class="inv-label">item discount:</label>
              <div style="display:flex; gap:6px; flex:1;">
                <input type="number" step="any" min="0" class="tm-input inv-control inv-item-input" data-field="discount" data-idx="${idx}" value="${discountStr}" style="flex:1;">
                <select class="tm-select inv-control inv-item-input" data-field="discountType" data-idx="${idx}" style="width:90px;">
                  <option value="fixed" ${item.discountType === 'fixed' ? 'selected' : ''}>fixed (${curr.symbol})</option>
                  <option value="percent" ${item.discountType === 'percent' ? 'selected' : ''}>percent (%)</option>
                </select>
              </div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="inv-form-section">
          <div class="inv-section-header-row">
            <span class="inv-section-title">line items</span>
            <button type="button" class="tm-btn tm-btn-primary tm-btn-xs" id="inv-add-item-btn">+ add item</button>
          </div>
          <div class="inv-items-list" id="inv-items-list">
            ${itemsRows || '<div class="c-dim" style="padding:10px;text-align:center;">no line items yet. click + add item above.</div>'}
          </div>
        </div>
      `;
    },

    getFinancialsTabHtml() {
      const f = this.state.financials;
      const curr = CURRENCIES[this.state.meta.currency] || CURRENCIES.USD;
      const decimals = curr.decimals;

      const discountStr = formatMinorUnitsToInput(f.globalDiscount || 0, decimals);
      const shippingStr = formatMinorUnitsToInput(f.shipping || 0, decimals);

      return `
        <div class="inv-form-section">
          <div class="inv-section-title">financial adjustments & fees</div>

          <div class="inv-field-row">
            <label class="inv-label" for="fin-discount">global discount (${curr.symbol}):</label>
            <input type="number" step="any" min="0" class="tm-input inv-control" id="fin-discount" value="${discountStr}" placeholder="0.00">
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="fin-shipping">shipping / delivery fee (${curr.symbol}):</label>
            <input type="number" step="any" min="0" class="tm-input inv-control" id="fin-shipping" value="${shippingStr}" placeholder="0.00">
          </div>
        </div>
      `;
    },

    getSettlementTabHtml() {
      const s = this.state.settlement;
      const m = this.state.meta;
      const isThermal = m.template === 'thermal-pos' || m.template === 'thermal-retail-mushak';
      const isReceipt = m.docType === 'receipt';
      const curr = CURRENCIES[m.currency] || CURRENCIES.USD;
      const decimals = curr.decimals;

      const paidStr = formatMinorUnitsToInput(s.amountPaid || 0, decimals);
      const tenderedStr = formatMinorUnitsToInput(s.tendered || 0, decimals);

      const hasUrl = /https?:\/\/[^\s]+/i.test((s.terms || '') + (s.bankDetails || '') + (m.barcodeValue || ''));
      const isMfs = s.method === 'MFS';
      const isCustomMfs = s.mfsProvider && !ALL_MFS_PSP_PROVIDERS.includes(s.mfsProvider);

      return `
        <div class="inv-form-section">
          <div class="inv-section-title">settlement &amp; payment</div>

          <div class="inv-field-row">
            <label class="inv-label" for="settle-method">payment method:</label>
            <select class="tm-select inv-control" id="settle-method">
              <option value="CASH" ${s.method === 'CASH' ? 'selected' : ''}>cash</option>
              <option value="COD" ${s.method === 'COD' ? 'selected' : ''}>cash on delivery (COD)</option>
              <option value="MFS" ${s.method === 'MFS' ? 'selected' : ''}>MFS &amp; PSP (mobile banking / payment wallets)</option>
              <option value="CARD" ${s.method === 'CARD' ? 'selected' : ''}>card (credit / debit)</option>
              <option value="TRANSFER" ${s.method === 'TRANSFER' ? 'selected' : ''}>bank transfer / online</option>
              <option value="CHECK" ${s.method === 'CHECK' ? 'selected' : ''}>cheque / check</option>
            </select>
          </div>

          <!-- MFS & PSP Dynamic Fields -->
          <div id="inv-mfs-fields" style="${isMfs ? 'display:flex;' : 'display:none;'}">
            <div class="inv-field-row">
              <label class="inv-label" for="settle-mfsprovider">provider:</label>
              <select class="tm-select inv-control" id="settle-mfsprovider">
                <optgroup label="Mobile Financial Services (MFS)">
                  ${MFS_PROVIDERS.map(p => `
                    <option value="${p}" ${(s.mfsProvider || (m.template === 'bn-vintage-ledger' ? 'bKash' : '')) === p ? 'selected' : ''}>${p}</option>
                  `).join('')}
                </optgroup>
                <optgroup label="Payment Service Providers (PSP)">
                  ${PSP_PROVIDERS.map(p => `
                    <option value="${p}" ${s.mfsProvider === p ? 'selected' : ''}>${p}</option>
                  `).join('')}
                </optgroup>
                <optgroup label="Others / Custom">
                  <option value="other" ${isCustomMfs ? 'selected' : ''}>other / custom provider...</option>
                </optgroup>
              </select>
            </div>

            <div class="inv-field-row" id="inv-mfs-custom-row" style="${isCustomMfs ? 'display:flex;' : 'display:none;'}">
              <label class="inv-label" for="settle-mfscustom">custom provider:</label>
              <input type="text" class="tm-input inv-control" id="settle-mfscustom" value="${escapeHTML(isCustomMfs ? s.mfsProvider : '')}" placeholder="provider name">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="settle-mfsnumber">wallet / mobile number:</label>
              <input type="text" class="tm-input inv-control" id="settle-mfsnumber" value="${escapeHTML(s.mfsNumber || '')}" placeholder="e.g. 017XXXXXXXX">
            </div>

            <div class="inv-field-row">
              <label class="inv-label" for="settle-trxid">transaction ID (TrxID):</label>
              <input type="text" class="tm-input inv-control" id="settle-trxid" value="${escapeHTML(s.trxId || '')}" placeholder="e.g. 9B8X2LK91A">
            </div>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="settle-amountpaid">amount paid (${curr.symbol}):</label>
            <input type="number" step="any" min="0" class="tm-input inv-control" id="settle-amountpaid" value="${paidStr}">
          </div>

          ${isThermal ? `
            <div class="inv-field-row">
              <label class="inv-label" for="settle-tendered">tendered / cash received (${curr.symbol}):</label>
              <input type="number" step="any" min="0" class="tm-input inv-control" id="settle-tendered" value="${tenderedStr}" placeholder="e.g. 1000.00">
            </div>
            <div class="inv-field-row">
              <label class="inv-label" for="settle-auth">card auth code:</label>
              <input type="text" class="tm-input inv-control" id="settle-auth" value="${escapeHTML(s.authCode || '')}" placeholder="e.g. AUTH: 839210">
            </div>
            <div class="inv-field-row">
              <label class="inv-label" for="settle-last4">card last 4 digits:</label>
              <input type="text" maxlength="4" class="tm-input inv-control" id="settle-last4" value="${escapeHTML(s.last4 || '')}" placeholder="e.g. 4242">
            </div>
          ` : ''}

          ${!isThermal ? `
            <div class="inv-field-row">
              <label class="inv-label" for="settle-bank">bank / wire details:</label>
              <textarea class="tm-input inv-control" id="settle-bank" rows="3" placeholder="IBAN, SWIFT / BIC, routing, account numbers">${escapeHTML(s.bankDetails || '')}</textarea>
            </div>
          ` : ''}

          <div class="inv-field-row">
            <label class="inv-label" for="settle-terms">notes &amp; policy terms:</label>
            <textarea class="tm-input inv-control" id="settle-terms" rows="4" placeholder="exchange policy, helpline, central VAT notes">${escapeHTML(s.terms || '')}</textarea>
          </div>

          <!-- Barcode / QR Code Quick Payload -->
          <div class="inv-section-title" style="margin-top:14px;">barcode &amp; QR payload</div>

          <div class="inv-field-row">
            <label class="inv-label" for="settle-symbology">symbology / format:</label>
            <select class="tm-select inv-control" id="settle-symbology">
              <option value="CODE128" ${m.barcodeSymbology === 'CODE128' ? 'selected' : ''}>Code 128 (universal 1D barcode)</option>
              <option value="QR" ${m.barcodeSymbology === 'QR' ? 'selected' : ''}>QR Code (2D payment link &amp; URL)</option>
              <option value="DATAMATRIX" ${m.barcodeSymbology === 'DATAMATRIX' ? 'selected' : ''}>Data Matrix (compact 2D code)</option>
              <option value="EAN13" ${m.barcodeSymbology === 'EAN13' ? 'selected' : ''}>EAN-13 (retail 13-digit standard)</option>
            </select>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="settle-barcodevalue">barcode / QR data:</label>
            <input type="text" class="tm-input inv-control" id="settle-barcodevalue" value="${escapeHTML(m.barcodeValue || '')}" placeholder="e.g. https://... or leave empty to auto-use doc number">
          </div>

          ${hasUrl && m.barcodeSymbology !== 'QR' ? `
            <div class="inv-url-notice" id="inv-url-notice">
              <span>url detected in payment terms.</span>
              <button type="button" class="tm-btn tm-btn-xs tm-btn-primary" id="inv-switch-qr-btn">switch barcode to QR Code</button>
            </div>
          ` : ''}
        </div>
      `;
    },

    getVintageTabHtml() {
      const v = this.state.vintageBn || {};

      return `
        <div class="inv-form-section">
          <div class="inv-section-title">vintage bengali ledger (হালখাতা) options</div>

          <div class="inv-field-row">
            <label class="inv-label" for="vbn-invocation">invocation header:</label>
            <select class="tm-select inv-control" id="vbn-invocation-sel" style="margin-right:6px;">
              <option value="॥ ৭ ॥" ${v.invocation === '॥ ৭ ॥' ? 'selected' : ''}>॥ ৭ ॥ (ঐতিহ্যবাহী)</option>
              <option value="॥ ৭৮৬ ॥" ${v.invocation === '॥ ৭৮৬ ॥' ? 'selected' : ''}>॥ ৭৮৬ ॥ (বিসমিল্লাহ)</option>
              <option value="॥ শ্রী শ্রী হরি ॥" ${v.invocation === '॥ শ্রী শ্রী হরি ॥' ? 'selected' : ''}>॥ শ্রী শ্রী হরি ॥</option>
              <option value="custom" ${!['॥ ৭ ॥', '॥ ৭৮৬ ॥', '॥ শ্রী শ্রী হরি ॥'].includes(v.invocation) ? 'selected' : ''}>কাস্টম...</option>
            </select>
            <input type="text" class="tm-input inv-control" id="vbn-invocation-custom" value="${escapeHTML(v.invocation || '॥ ৭ ॥')}" style="flex:1;">
          </div>

          <div class="inv-field-row">
            <label class="tm-checkbox-label">
              <input type="checkbox" id="vbn-showseal" ${v.showSeal ? 'checked' : ''}>
              show decorative rubber seal / revenue stamp (পরিশোধিত সিল)
            </label>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="vbn-sealtext">seal stamp text:</label>
            <input type="text" class="tm-input inv-control" id="vbn-sealtext" value="${escapeHTML(v.sealText || 'পরিশোধিত')}" placeholder="e.g. পরিশোধিত / VERIFIED">
          </div>

          <div class="inv-field-row">
            <label class="tm-checkbox-label">
              <input type="checkbox" id="vbn-showsig" ${v.showSignature ? 'checked' : ''}>
              show proprietor cursive signature line (স্বাক্ষর)
            </label>
          </div>

          <div class="inv-field-row">
            <label class="inv-label" for="vbn-sigtitle">signature title:</label>
            <input type="text" class="tm-input inv-control" id="vbn-sigtitle" value="${escapeHTML(v.signatureTitle || 'মালিক / কর্তৃপক্ষ')}" placeholder="e.g. মালিক / কর্তৃপক্ষ">
          </div>

          <div class="inv-field-row">
            <label class="tm-checkbox-label">
              <input type="checkbox" id="vbn-showwords" ${v.showWordsAmount ? 'checked' : ''}>
              show automatic bengali amount in words (কথায়: ... টাকা মাত্র)
            </label>
          </div>
        </div>
      `;
    },

    attachFormEvents(container) {
      const curr = CURRENCIES[this.state.meta.currency] || CURRENCIES.USD;
      const decimals = curr.decimals;

      // Handle simple inputs
      const handleInput = (id, setter) => {
        const el = container.querySelector('#' + id);
        if (el) {
          el.addEventListener('input', (e) => {
            setter(e.target.value);
            this.schedulePreviewUpdate();
          });
          el.addEventListener('change', (e) => {
            setter(e.target.value);
            this.schedulePreviewUpdate();
          });
        }
      };

      // Setup inputs
      handleInput('meta-template', val => {
        this.setTemplate(val);
      });
      handleInput('meta-doctype', val => {
        this.setDocType(val);
      });
      handleInput('meta-docnumber', val => { this.state.meta.docNumber = val; });
      handleInput('meta-issuedate', val => { this.state.meta.issueDate = val; });
      handleInput('meta-duedate', val => { this.state.meta.dueDate = val; });
      handleInput('meta-currency', val => {
        this.state.meta.currency = val;
        this.renderFormContent();
      });
      handleInput('meta-symbology', val => { this.state.meta.barcodeSymbology = val; });
      handleInput('meta-barcodevalue', val => { this.state.meta.barcodeValue = val; });
      handleInput('meta-thermalwidth', val => { this.state.meta.thermalWidth = val; });

      const showBarcodeEl = container.querySelector('#meta-showbarcode');
      if (showBarcodeEl) {
        showBarcodeEl.addEventListener('change', () => {
          this.state.meta.showBarcode = showBarcodeEl.checked;
          this.schedulePreviewUpdate();
        });
      }

      // Seller inputs
      handleInput('seller-name', val => { this.state.seller.name = val; });
      handleInput('seller-company', val => { this.state.seller.companyName = val; });
      handleInput('seller-regaddress', val => { this.state.seller.registeredAddress = val; });
      handleInput('seller-outletname', val => { this.state.seller.outletName = val; });
      handleInput('seller-outletaddress', val => { this.state.seller.outletAddress = val; });
      handleInput('seller-address', val => { this.state.seller.address = val; });
      handleInput('seller-taxid', val => { this.state.seller.taxId = val; });
      handleInput('seller-email', val => { this.state.seller.email = val; });
      handleInput('seller-terminal', val => { this.state.seller.terminalId = val; });
      handleInput('seller-cashier', val => { this.state.seller.cashier = val; });

      // Logo handler
      const logoZone = container.querySelector('#inv-logo-zone');
      const logoInput = container.querySelector('#inv-logo-file-input');
      const removeLogoBtn = container.querySelector('#inv-remove-logo-btn');

      if (logoZone && logoInput) {
        logoZone.addEventListener('click', (e) => {
          if (e.target.closest('#inv-remove-logo-btn')) return;
          logoInput.click();
        });
        logoZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          logoZone.classList.add('dragover');
        });
        logoZone.addEventListener('dragleave', () => {
          logoZone.classList.remove('dragover');
        });
        logoZone.addEventListener('drop', (e) => {
          e.preventDefault();
          logoZone.classList.remove('dragover');
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            this.handleLogoFile(e.dataTransfer.files[0]);
          }
        });
        logoInput.addEventListener('change', () => {
          if (logoInput.files && logoInput.files[0]) {
            this.handleLogoFile(logoInput.files[0]);
          }
        });
      }

      if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.state.seller.logoUrl = '';
          this.saveToStorage();
          this.render();
        });
      }

      // Buyer inputs
      handleInput('buyer-name', val => { this.state.buyer.name = val; });
      handleInput('buyer-address', val => { this.state.buyer.address = val; });
      handleInput('buyer-taxid', val => { this.state.buyer.taxId = val; });
      handleInput('buyer-email', val => { this.state.buyer.email = val; });
      handleInput('buyer-ponumber', val => { this.state.buyer.poNumber = val; });
      handleInput('buyer-phone', val => { this.state.buyer.phone = val; });

      // Loyalty inputs
      const loyaltyCheck = container.querySelector('#loyalty-enabled');
      if (loyaltyCheck) {
        loyaltyCheck.addEventListener('change', () => {
          this.state.loyalty = this.state.loyalty || {};
          this.state.loyalty.enabled = loyaltyCheck.checked;
          this.schedulePreviewUpdate();
        });
      }
      handleInput('loyalty-prev', val => {
        this.state.loyalty = this.state.loyalty || {};
        this.state.loyalty.previousPoints = parseInt(val, 10) || 0;
      });
      handleInput('loyalty-earned', val => {
        this.state.loyalty = this.state.loyalty || {};
        this.state.loyalty.earnedPoints = parseInt(val, 10) || 0;
      });

      // Items list inputs
      const itemsList = container.querySelector('#inv-items-list');
      if (itemsList) {
        itemsList.addEventListener('input', (e) => {
          const input = e.target.closest('.inv-item-input');
          if (!input) return;
          const idx = parseInt(input.dataset.idx, 10);
          const field = input.dataset.field;
          const item = this.state.items[idx];
          if (!item) return;

          if (field === 'qty') {
            item.qty = Math.max(0, parseFloat(input.value) || 0);
          } else if (field === 'unitPrice') {
            item.unitPrice = parseToMinorUnits(input.value, decimals);
          } else if (field === 'taxRate') {
            item.taxRate = Math.max(0, parseFloat(input.value) || 0);
          } else if (field === 'discount') {
            if (item.discountType === 'percent') {
              item.discount = Math.max(0, parseFloat(input.value) || 0);
            } else {
              item.discount = parseToMinorUnits(input.value, decimals);
            }
          } else if (field === 'discountType') {
            item.discountType = input.value;
          } else {
            item[field] = input.value;
          }
          this.schedulePreviewUpdate();
        });

        itemsList.addEventListener('click', (e) => {
          const btn = e.target.closest('button');
          if (!btn) return;
          const idx = parseInt(btn.dataset.idx, 10);

          if (btn.classList.contains('inv-item-del')) {
            this.state.items.splice(idx, 1);
            this.saveToStorage();
            this.renderFormContent();
            this.renderLivePreview();
          } else if (btn.classList.contains('inv-item-up') && idx > 0) {
            const temp = this.state.items[idx];
            this.state.items[idx] = this.state.items[idx - 1];
            this.state.items[idx - 1] = temp;
            this.saveToStorage();
            this.renderFormContent();
            this.renderLivePreview();
          } else if (btn.classList.contains('inv-item-down') && idx < this.state.items.length - 1) {
            const temp = this.state.items[idx];
            this.state.items[idx] = this.state.items[idx + 1];
            this.state.items[idx + 1] = temp;
            this.saveToStorage();
            this.renderFormContent();
            this.renderLivePreview();
          }
        });
      }

      const addItemBtn = container.querySelector('#inv-add-item-btn');
      if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
          this.state.items.push({
            id: 'item-' + Date.now(),
            name: 'New Line Item',
            description: '',
            qty: 1,
            unitPrice: 1000,
            taxRate: 0,
            discount: 0,
            discountType: 'fixed'
          });
          this.saveToStorage();
          this.renderFormContent();
          this.renderLivePreview();
        });
      }

      // Financials inputs
      handleInput('fin-discount', val => {
        this.state.financials.globalDiscount = parseToMinorUnits(val, decimals);
      });
      handleInput('fin-shipping', val => {
        this.state.financials.shipping = parseToMinorUnits(val, decimals);
      });

      // Settlement inputs
      handleInput('settle-method', val => {
        this.state.settlement.method = val;
        const mfsBox = container.querySelector('#inv-mfs-fields');
        if (mfsBox) {
          mfsBox.style.display = val === 'MFS' ? 'flex' : 'none';
        }
      });
      handleInput('settle-mfsprovider', val => {
        const customRow = container.querySelector('#inv-mfs-custom-row');
        if (val === 'other') {
          if (customRow) customRow.style.display = 'flex';
          const customIn = container.querySelector('#settle-mfscustom');
          this.state.settlement.mfsProvider = (customIn && customIn.value.trim()) ? customIn.value.trim() : 'custom';
        } else {
          if (customRow) customRow.style.display = 'none';
          this.state.settlement.mfsProvider = val;
        }
      });
      handleInput('settle-mfscustom', val => {
        this.state.settlement.mfsProvider = val.trim() || 'custom';
      });
      handleInput('settle-mfsnumber', val => {
        this.state.settlement.mfsNumber = val;
      });
      handleInput('settle-trxid', val => {
        this.state.settlement.trxId = val;
      });
      handleInput('settle-symbology', val => {
        this.state.meta.barcodeSymbology = val;
      });
      handleInput('settle-barcodevalue', val => {
        this.state.meta.barcodeValue = val;
      });
      handleInput('settle-amountpaid', val => {
        this.state.settlement.amountPaid = parseToMinorUnits(val, decimals);
      });
      handleInput('settle-tendered', val => {
        this.state.settlement.tendered = parseToMinorUnits(val, decimals);
      });
      handleInput('settle-auth', val => { this.state.settlement.authCode = val; });
      handleInput('settle-last4', val => { this.state.settlement.last4 = val; });
      handleInput('settle-bank', val => {
        this.state.settlement.bankDetails = val;
        this.checkUrlInTerms();
      });
      handleInput('settle-terms', val => {
        this.state.settlement.terms = val;
        this.checkUrlInTerms();
      });

      const switchQrBtn = container.querySelector('#inv-switch-qr-btn');
      if (switchQrBtn) {
        switchQrBtn.addEventListener('click', () => {
          this.state.meta.barcodeSymbology = 'QR';
          this.saveToStorage();
          this.render();
        });
      }

      // Vintage tab inputs
      const invSel = container.querySelector('#vbn-invocation-sel');
      const invCustom = container.querySelector('#vbn-invocation-custom');
      if (invSel && invCustom) {
        invSel.addEventListener('change', () => {
          if (invSel.value !== 'custom') {
            invCustom.value = invSel.value;
            this.state.vintageBn.invocation = invSel.value;
            this.schedulePreviewUpdate();
          }
        });
        invCustom.addEventListener('input', () => {
          this.state.vintageBn.invocation = invCustom.value;
          this.schedulePreviewUpdate();
        });
      }

      const showSealCheck = container.querySelector('#vbn-showseal');
      if (showSealCheck) {
        showSealCheck.addEventListener('change', () => {
          this.state.vintageBn.showSeal = showSealCheck.checked;
          this.schedulePreviewUpdate();
        });
      }

      handleInput('vbn-sealtext', val => { this.state.vintageBn.sealText = val; });

      const showSigCheck = container.querySelector('#vbn-showsig');
      if (showSigCheck) {
        showSigCheck.addEventListener('change', () => {
          this.state.vintageBn.showSignature = showSigCheck.checked;
          this.schedulePreviewUpdate();
        });
      }

      handleInput('vbn-sigtitle', val => { this.state.vintageBn.signatureTitle = val; });

      const showWordsCheck = container.querySelector('#vbn-showwords');
      if (showWordsCheck) {
        showWordsCheck.addEventListener('change', () => {
          this.state.vintageBn.showWordsAmount = showWordsCheck.checked;
          this.schedulePreviewUpdate();
        });
      }
    },

    checkUrlInTerms() {
      const s = this.state.settlement;
      const hasUrl = /https?:\/\/[^\s]+/i.test((s.terms || '') + (s.bankDetails || ''));
      const notice = document.getElementById('inv-url-notice');
      if (notice) {
        notice.style.display = hasUrl && this.state.meta.barcodeSymbology !== 'QR' ? 'flex' : 'none';
      }
    },

    handleLogoFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        alert('please select a valid image file (PNG, JPEG, SVG, WebP)');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        alert('image size exceeds 4MB. please choose a smaller logo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.state.seller.logoUrl = e.target.result;
        this.saveToStorage();
        this.render();
      };
      reader.readAsDataURL(file);
    },

    schedulePreviewUpdate() {
      if (this.previewTimer) clearTimeout(this.previewTimer);
      this.previewTimer = setTimeout(() => {
        this.saveToStorage();
        this.renderLivePreview();
      }, 50);
    },

    renderLivePreview() {
      const paperTarget = document.getElementById('inv-paper-target');
      const geoLabel = document.getElementById('inv-preview-geo');
      if (!paperTarget) return;

      const totals = computeDocumentTotals(this.state);
      const template = this.state.meta.template || 'stripe-modern';

      // Update paper class
      paperTarget.className = `inv-paper inv-tpl-${template}`;
      if (template === 'thermal-pos' || template === 'thermal-retail-mushak') {
        paperTarget.classList.toggle('thermal-58mm', this.state.meta.thermalWidth === '58mm');
      }

      if (geoLabel) {
        if (template === 'thermal-pos') {
          geoLabel.textContent = `thermal continuous roll (${this.state.meta.thermalWidth || '80mm'})`;
        } else if (template === 'thermal-retail-mushak') {
          geoLabel.textContent = `supermarket challan Mushak-6.3 (${this.state.meta.thermalWidth || '80mm'})`;
        } else if (template === 'bn-vintage-ledger') {
          geoLabel.textContent = 'vintage bengali ledger (A4 cream)';
        } else if (template === 'mid-century-tractor') {
          geoLabel.textContent = 'continuous tractor-feed (dot-matrix green-bar)';
        } else if (template === 'erp-classic-90s') {
          geoLabel.textContent = 'enterprise ERP classic (boxed grid)';
        } else {
          geoLabel.textContent = 'A4 / letter standard (vector)';
        }
      }

      let docHtml = '';
      if (template === 'stripe-modern') {
        docHtml = this.generateStripeModernHtml(this.state, totals);
      } else if (template === 'thermal-pos') {
        docHtml = this.generateThermalPosHtml(this.state, totals);
      } else if (template === 'minimal-classic') {
        docHtml = this.generateMinimalClassicHtml(this.state, totals);
      } else if (template === 'bn-vintage-ledger') {
        docHtml = this.generateBnVintageLedgerHtml(this.state, totals);
      } else if (template === 'mid-century-tractor') {
        docHtml = this.generateMidCenturyTractorHtml(this.state, totals);
      } else if (template === 'erp-classic-90s') {
        docHtml = this.generateErpClassic90sHtml(this.state, totals);
      } else if (template === 'thermal-retail-mushak') {
        docHtml = this.generateThermalRetailMushakHtml(this.state, totals);
      } else {
        docHtml = this.generateStripeModernHtml(this.state, totals);
      }

      paperTarget.innerHTML = docHtml;

      // Render barcode into hook target
      const barcodeEl = paperTarget.querySelector('#receipt-barcode-target');
      if (barcodeEl) {
        if (this.state.meta.showBarcode === false) {
          barcodeEl.style.display = 'none';
          barcodeEl.innerHTML = '';
        } else {
          barcodeEl.style.display = '';
          const explicitText = (this.state.meta.barcodeValue && this.state.meta.barcodeValue.trim());
          const fallbackUrl = this.extractSettlementUrl();
          const targetText = explicitText || fallbackUrl || this.state.meta.docNumber || 'DOC-0001';
          updateReceiptBarcode(barcodeEl, targetText, this.state.meta.barcodeSymbology, fallbackUrl);
        }
      }
    },

    extractSettlementUrl() {
      if (this.state.meta.barcodeValue && this.state.meta.barcodeValue.trim()) {
        return this.state.meta.barcodeValue.trim();
      }
      const match = ((this.state.settlement.terms || '') + ' ' + (this.state.settlement.bankDetails || '')).match(/https?:\/\/[^\s]+/i);
      return match ? match[0] : '';
    },

    // --- TEMPLATE A: STRIPE-STYLE MODERN ---
    generateStripeModernHtml(state, totals) {
      const m = state.meta;
      const s = state.seller;
      const b = state.buyer;
      const curr = m.currency;

      const badgeText = m.docType === 'receipt' ? 'PAID'
        : m.docType === 'pro-forma' ? 'PRO FORMA'
          : m.docType === 'tax-invoice' ? 'TAX INVOICE'
            : totals.balanceDue === 0 ? 'PAID' : 'DUE';

      const badgeClass = badgeText === 'PAID' ? 'inv-badge-paid' : 'inv-badge-due';

      let itemsHtml = state.items.map(item => {
        const qty = Number(item.qty) || 0;
        const price = Math.round(Number(item.unitPrice) || 0);
        const base = Math.round(qty * price);
        const disc = item.discountType === 'percent'
          ? Math.round(base * ((Number(item.discount) || 0) / 100))
          : Math.min(base, Math.round(Number(item.discount) || 0));
        const lineTotal = base - disc;

        return `
          <tr class="inv-stripe-tr">
            <td class="inv-stripe-td item-desc-cell">
              <div class="inv-item-title">${escapeHTML(item.name)}</div>
              ${item.description ? `<div class="inv-item-subdesc">${escapeHTML(item.description)}</div>` : ''}
            </td>
            <td class="inv-stripe-td text-right">${qty}</td>
            <td class="inv-stripe-td text-right">${formatDisplayCurrency(price, curr)}</td>
            <td class="inv-stripe-td text-right">${item.taxRate ? item.taxRate + '%' : '0%'}</td>
            <td class="inv-stripe-td text-right font-medium">${formatDisplayCurrency(lineTotal, curr)}</td>
          </tr>
        `;
      }).join('');

      return `
        <div class="inv-stripe-doc">
          <!-- Header Split Grid -->
          <div class="inv-stripe-header">
            <div class="inv-stripe-brand">
              ${s.logoUrl ? `<img src="${s.logoUrl}" class="inv-stripe-logo" alt="business logo">` : ''}
              <div class="inv-stripe-company">${escapeHTML(s.name)}</div>
              <div class="inv-stripe-subaddr">${escapeHTML(s.address).replace(/\n/g, '<br>')}</div>
              ${s.taxId ? `<div class="inv-stripe-taxid">${escapeHTML(s.taxId)}</div>` : ''}
              ${s.email ? `<div class="inv-stripe-contact">${escapeHTML(s.email)}</div>` : ''}
            </div>
            <div class="inv-stripe-meta">
              <div class="inv-stripe-badge ${badgeClass}">${badgeText}</div>
              <div class="inv-stripe-docno">${escapeHTML(m.docNumber)}</div>
              <div class="inv-stripe-date-row"><span>Issue Date:</span> <span>${escapeHTML(m.issueDate)}</span></div>
              ${m.dueDate && m.docType !== 'receipt' ? `<div class="inv-stripe-date-row"><span>Due Date:</span> <span>${escapeHTML(m.dueDate)}</span></div>` : ''}
              ${b.poNumber ? `<div class="inv-stripe-date-row"><span>PO Number:</span> <span>${escapeHTML(b.poNumber)}</span></div>` : ''}
            </div>
          </div>

          <!-- Entity Block (Billed By vs Billed To) -->
          <div class="inv-stripe-entities">
            <div class="inv-stripe-entity-card">
              <div class="inv-stripe-entity-label">BILLED BY</div>
              <div class="inv-stripe-entity-name">${escapeHTML(s.name)}</div>
              <div class="inv-stripe-entity-detail">${escapeHTML(s.address).replace(/\n/g, '<br>')}</div>
              ${s.taxId ? `<div class="inv-stripe-entity-tax">Tax ID: ${escapeHTML(s.taxId)}</div>` : ''}
            </div>
            <div class="inv-stripe-entity-card">
              <div class="inv-stripe-entity-label">BILLED TO</div>
              <div class="inv-stripe-entity-name">${escapeHTML(b.name || 'Valued Client')}</div>
              <div class="inv-stripe-entity-detail">${escapeHTML(b.address || '').replace(/\n/g, '<br>')}</div>
              ${b.taxId ? `<div class="inv-stripe-entity-tax">Tax ID: ${escapeHTML(b.taxId)}</div>` : ''}
              ${b.email ? `<div class="inv-stripe-entity-contact">${escapeHTML(b.email)}</div>` : ''}
            </div>
          </div>

          <!-- Line Items Table -->
          <table class="inv-stripe-table">
            <thead>
              <tr>
                <th class="inv-stripe-th text-left">ITEM &amp; DESCRIPTION</th>
                <th class="inv-stripe-th text-right" style="width:50px;">QTY</th>
                <th class="inv-stripe-th text-right" style="width:90px;">UNIT PRICE</th>
                <th class="inv-stripe-th text-right" style="width:70px;">TAX RATE</th>
                <th class="inv-stripe-th text-right" style="width:100px;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals Module (Right-aligned ledger) -->
          <div class="inv-stripe-totals-wrap">
            <div class="inv-stripe-totals-table">
              <div class="inv-stripe-tot-row">
                <span>Subtotal</span>
                <span>${formatDisplayCurrency(totals.subtotal, curr)}</span>
              </div>
              ${totals.globalDiscount > 0 ? `
                <div class="inv-stripe-tot-row">
                  <span>Discount</span>
                  <span>-${formatDisplayCurrency(totals.globalDiscount, curr)}</span>
                </div>
              ` : ''}
              ${Object.keys(totals.taxBuckets).map(rate => `
                <div class="inv-stripe-tot-row">
                  <span>Tax (${rate}%)</span>
                  <span>${formatDisplayCurrency(totals.taxBuckets[rate], curr)}</span>
                </div>
              `).join('')}
              ${totals.shipping > 0 ? `
                <div class="inv-stripe-tot-row">
                  <span>Shipping</span>
                  <span>${formatDisplayCurrency(totals.shipping, curr)}</span>
                </div>
              ` : ''}
              <div class="inv-stripe-tot-row inv-stripe-grand-row">
                <span>Total Amount</span>
                <span>${formatDisplayCurrency(totals.grandTotal, curr)}</span>
              </div>
              <div class="inv-stripe-tot-row">
                <span>Amount Paid</span>
                <span>${formatDisplayCurrency(totals.amountPaid, curr)}</span>
              </div>
              <div class="inv-stripe-tot-row inv-stripe-due-row">
                <span>Balance Due</span>
                <span>${formatDisplayCurrency(totals.balanceDue, curr)}</span>
              </div>
            </div>
          </div>

          <!-- Footer & Settlement -->
          <div class="inv-stripe-footer">
            <div class="inv-stripe-footer-left">
              ${state.settlement.method === 'MFS' ? `
                <div class="inv-stripe-foot-block">
                  <div class="inv-foot-heading">Payment Method:</div>
                  <div class="inv-foot-body">
                    <strong>Mobile Financial Service (${escapeHTML(state.settlement.mfsProvider || 'MFS')})</strong>
                    ${state.settlement.mfsNumber ? `<br>Account / Mobile: ${escapeHTML(state.settlement.mfsNumber)}` : ''}
                    ${state.settlement.trxId ? `<br>Transaction ID: <span style="font-family:monospace;font-weight:bold;">${escapeHTML(state.settlement.trxId)}</span>` : ''}
                  </div>
                </div>
              ` : state.settlement.method === 'COD' ? `
                <div class="inv-stripe-foot-block">
                  <div class="inv-foot-heading">Payment Method:</div>
                  <div class="inv-foot-body"><strong>Cash on Delivery (COD)</strong></div>
                </div>
              ` : ''}
              ${state.settlement.bankDetails ? `
                <div class="inv-stripe-foot-block">
                  <div class="inv-foot-heading">Payment Instructions &amp; Bank Details:</div>
                  <div class="inv-foot-body">${escapeHTML(state.settlement.bankDetails).replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
              ${state.settlement.terms ? `
                <div class="inv-stripe-foot-block">
                  <div class="inv-foot-heading">Terms &amp; Conditions:</div>
                  <div class="inv-foot-body">${escapeHTML(state.settlement.terms).replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
            </div>
            <div class="inv-stripe-footer-right">
              <div id="receipt-barcode-target" class="receipt-barcode-target"></div>
            </div>
          </div>
        </div>
      `;
    },

    // --- TEMPLATE B: THERMAL POS (CONTINUOUS ROLL) ---
    generateThermalPosHtml(state, totals) {
      const s = state.seller;
      const m = state.meta;
      const curr = m.currency;
      const is58 = m.thermalWidth === '58mm';
      const colWidth = is58 ? 24 : 36;
      const divider = '-'.repeat(colWidth);

      let itemsRows = state.items.map(item => {
        const qty = Number(item.qty) || 0;
        const price = Math.round(Number(item.unitPrice) || 0);
        const base = Math.round(qty * price);
        const disc = item.discountType === 'percent'
          ? Math.round(base * ((Number(item.discount) || 0) / 100))
          : Math.min(base, Math.round(Number(item.discount) || 0));
        const lineTotal = base - disc;

        const priceStr = formatDisplayCurrency(price, curr);
        const totalStr = formatDisplayCurrency(lineTotal, curr);

        return `
          <div class="inv-thermal-item">
            <div class="inv-thermal-item-line1">${escapeHTML(item.name)}</div>
            <div class="inv-thermal-item-line2">
              <span>${qty} x ${priceStr}</span>
              <span>${totalStr}</span>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="inv-thermal-doc ${is58 ? 'mode-58mm' : 'mode-80mm'}">
          <!-- Header -->
          <div class="inv-thermal-header text-center">
            ${s.logoUrl ? `<img src="${s.logoUrl}" class="inv-thermal-logo" alt="store logo">` : ''}
            <div class="inv-thermal-store-name">${escapeHTML(s.name)}</div>
            <div class="inv-thermal-sub">${escapeHTML(s.address).replace(/\n/g, '<br>')}</div>
            ${s.taxId ? `<div class="inv-thermal-sub">${escapeHTML(s.taxId)}</div>` : ''}
            <div class="inv-thermal-divider">${divider}</div>
            <div class="inv-thermal-meta-row">
              <span>${s.terminalId || 'TERM: 01'}</span>
              <span>CASHIER: ${escapeHTML(s.cashier || 'STAFF')}</span>
            </div>
            <div class="inv-thermal-meta-row">
              <span>${escapeHTML(m.docNumber)}</span>
              <span>${escapeHTML(m.issueDate)}</span>
            </div>
            <div class="inv-thermal-divider">${divider}</div>
          </div>

          <!-- Items -->
          <div class="inv-thermal-items">
            ${itemsRows}
          </div>

          <div class="inv-thermal-divider">${divider}</div>

          <!-- Financials -->
          <div class="inv-thermal-totals">
            <div class="inv-thermal-tot-row">
              <span>SUBTOTAL:</span>
              <span>${formatDisplayCurrency(totals.subtotal, curr)}</span>
            </div>
            ${totals.globalDiscount > 0 ? `
              <div class="inv-thermal-tot-row">
                <span>DISCOUNT:</span>
                <span>-${formatDisplayCurrency(totals.globalDiscount, curr)}</span>
              </div>
            ` : ''}
            ${Object.keys(totals.taxBuckets).map(rate => `
              <div class="inv-thermal-tot-row">
                <span>TAX (${rate}%):</span>
                <span>${formatDisplayCurrency(totals.taxBuckets[rate], curr)}</span>
              </div>
            `).join('')}
            <div class="inv-thermal-tot-row font-bold total-large">
              <span>TOTAL:</span>
              <span>${formatDisplayCurrency(totals.grandTotal, curr)}</span>
            </div>
          </div>

          <div class="inv-thermal-divider">${divider}</div>

          <!-- Tender Block -->
          <div class="inv-thermal-tender">
            <div class="inv-thermal-tot-row">
              <span>METHOD:</span>
              <span>${state.settlement.method === 'COD' ? 'CASH ON DELIVERY'
          : state.settlement.method === 'MFS' ? `MFS - ${escapeHTML(state.settlement.mfsProvider || 'MFS').toUpperCase()}`
            : escapeHTML(state.settlement.method || 'CASH')
        }</span>
            </div>
            ${state.settlement.method === 'MFS' ? `
              ${state.settlement.mfsNumber ? `
                <div class="inv-thermal-tot-row">
                  <span>MOBILE:</span>
                  <span>${escapeHTML(state.settlement.mfsNumber)}</span>
                </div>
              ` : ''}
              ${state.settlement.trxId ? `
                <div class="inv-thermal-tot-row">
                  <span>TRXID:</span>
                  <span>${escapeHTML(state.settlement.trxId)}</span>
                </div>
              ` : ''}
            ` : ''}
            ${state.settlement.method === 'CASH' && totals.tendered > 0 ? `
              <div class="inv-thermal-tot-row">
                <span>TENDERED:</span>
                <span>${formatDisplayCurrency(totals.tendered, curr)}</span>
              </div>
              <div class="inv-thermal-tot-row font-bold">
                <span>CHANGE GIVEN:</span>
                <span>${formatDisplayCurrency(totals.change, curr)}</span>
              </div>
            ` : ''}
            ${state.settlement.method === 'CARD' ? `
              <div class="inv-thermal-tot-row">
                <span>CARD:</span>
                <span>**** **** **** ${escapeHTML(state.settlement.last4 || '0000')}</span>
              </div>
              ${state.settlement.authCode ? `
                <div class="inv-thermal-tot-row">
                  <span>AUTH CODE:</span>
                  <span>${escapeHTML(state.settlement.authCode)}</span>
                </div>
              ` : ''}
            ` : ''}
          </div>

          <div class="inv-thermal-divider">${divider}</div>

          <!-- Footer -->
          <div class="inv-thermal-footer text-center">
            ${state.settlement.terms ? `<div class="inv-thermal-policy">${escapeHTML(state.settlement.terms)}</div>` : ''}
            <div id="receipt-barcode-target" class="receipt-barcode-target thermal-barcode"></div>
            <div class="inv-thermal-thankyou">*** THANK YOU FOR YOUR VISIT ***</div>
          </div>
        </div>
      `;
    },

    // --- TEMPLATE C: MINIMAL CLASSIC (FREELANCER / CONTRACTOR) ---
    generateMinimalClassicHtml(state, totals) {
      const s = state.seller;
      const b = state.buyer;
      const m = state.meta;
      const curr = m.currency;

      let itemsRows = state.items.map((item, idx) => {
        const qty = Number(item.qty) || 0;
        const price = Math.round(Number(item.unitPrice) || 0);
        const base = Math.round(qty * price);
        const disc = item.discountType === 'percent'
          ? Math.round(base * ((Number(item.discount) || 0) / 100))
          : Math.min(base, Math.round(Number(item.discount) || 0));
        const lineTotal = base - disc;

        return `
          <tr class="inv-classic-tr">
            <td class="inv-classic-td text-center" style="width:30px;">${idx + 1}</td>
            <td class="inv-classic-td">
              <div class="inv-classic-item-name">${escapeHTML(item.name)}</div>
              ${item.description ? `<div class="inv-classic-item-desc">${escapeHTML(item.description)}</div>` : ''}
            </td>
            <td class="inv-classic-td text-right">${qty}</td>
            <td class="inv-classic-td text-right">${formatDisplayCurrency(price, curr)}</td>
            <td class="inv-classic-td text-right">${formatDisplayCurrency(lineTotal, curr)}</td>
          </tr>
        `;
      }).join('');

      return `
        <div class="inv-classic-doc">
          <div class="inv-classic-masthead">
            <div class="inv-classic-seller-block">
              ${s.logoUrl ? `<img src="${s.logoUrl}" class="inv-classic-logo" alt="logo">` : ''}
              <div class="inv-classic-author">${escapeHTML(s.name)}</div>
              <div class="inv-classic-meta-text">${escapeHTML(s.address).replace(/\n/g, '<br>')}</div>
              ${s.taxId ? `<div class="inv-classic-meta-text">Tax Registration: ${escapeHTML(s.taxId)}</div>` : ''}
              ${s.email ? `<div class="inv-classic-meta-text">${escapeHTML(s.email)}</div>` : ''}
            </div>
            <div class="inv-classic-title-block">
              <h1 class="inv-classic-title">${m.docType === 'receipt' ? 'RECEIPT' : 'INVOICE'}</h1>
              <div class="inv-classic-docno">${escapeHTML(m.docNumber)}</div>
              <div class="inv-classic-line"><span>Date:</span> <span>${escapeHTML(m.issueDate)}</span></div>
              ${m.dueDate && m.docType !== 'receipt' ? `<div class="inv-classic-line"><span>Due:</span> <span>${escapeHTML(m.dueDate)}</span></div>` : ''}
              ${b.poNumber ? `<div class="inv-classic-line"><span>PO Ref:</span> <span>${escapeHTML(b.poNumber)}</span></div>` : ''}
            </div>
          </div>

          <div class="inv-classic-divider"></div>

          <div class="inv-classic-buyer-block">
            <div class="inv-classic-caption">RECIPIENT / BILLED TO:</div>
            <div class="inv-classic-buyer-name">${escapeHTML(b.name || 'Client')}</div>
            <div class="inv-classic-meta-text">${escapeHTML(b.address || '').replace(/\n/g, '<br>')}</div>
            ${b.taxId ? `<div class="inv-classic-meta-text">Tax ID: ${escapeHTML(b.taxId)}</div>` : ''}
          </div>

          <table class="inv-classic-table">
            <thead>
              <tr>
                <th class="inv-classic-th text-center">#</th>
                <th class="inv-classic-th text-left">Description</th>
                <th class="inv-classic-th text-right">Qty</th>
                <th class="inv-classic-th text-right">Rate</th>
                <th class="inv-classic-th text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="inv-classic-bottom-grid">
            <div class="inv-classic-terms">
              ${state.settlement.method === 'MFS' ? `
                <div class="inv-classic-block">
                  <div class="inv-classic-heading">Payment Information:</div>
                  <div class="inv-classic-body">
                    Method: MFS (${escapeHTML(state.settlement.mfsProvider || 'Mobile Wallet')})
                    ${state.settlement.mfsNumber ? `<br>Account / Mobile: ${escapeHTML(state.settlement.mfsNumber)}` : ''}
                    ${state.settlement.trxId ? `<br>Transaction ID: <span style="font-family:monospace;font-weight:bold;">${escapeHTML(state.settlement.trxId)}</span>` : ''}
                  </div>
                </div>
              ` : state.settlement.method === 'COD' ? `
                <div class="inv-classic-block">
                  <div class="inv-classic-heading">Payment Terms:</div>
                  <div class="inv-classic-body">Cash on Delivery (COD)</div>
                </div>
              ` : ''}
              ${state.settlement.bankDetails ? `
                <div class="inv-classic-block">
                  <div class="inv-classic-heading">Remittance &amp; Bank Details:</div>
                  <div class="inv-classic-body">${escapeHTML(state.settlement.bankDetails).replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
              ${state.settlement.terms ? `
                <div class="inv-classic-block">
                  <div class="inv-classic-heading">Terms &amp; Conditions:</div>
                  <div class="inv-classic-body">${escapeHTML(state.settlement.terms).replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
            </div>

            <div class="inv-classic-totals-pane">
              <div class="inv-classic-sum-row">
                <span>Subtotal:</span>
                <span>${formatDisplayCurrency(totals.subtotal, curr)}</span>
              </div>
              ${totals.globalDiscount > 0 ? `
                <div class="inv-classic-sum-row">
                  <span>Discount:</span>
                  <span>-${formatDisplayCurrency(totals.globalDiscount, curr)}</span>
                </div>
              ` : ''}
              ${Object.keys(totals.taxBuckets).map(rate => `
                <div class="inv-classic-sum-row">
                  <span>Tax (${rate}%):</span>
                  <span>${formatDisplayCurrency(totals.taxBuckets[rate], curr)}</span>
                </div>
              `).join('')}
              ${totals.shipping > 0 ? `
                <div class="inv-classic-sum-row">
                  <span>Shipping:</span>
                  <span>${formatDisplayCurrency(totals.shipping, curr)}</span>
                </div>
              ` : ''}
              <div class="inv-classic-sum-row inv-classic-total-row">
                <span>Total Amount:</span>
                <span>${formatDisplayCurrency(totals.grandTotal, curr)}</span>
              </div>
              <div class="inv-classic-sum-row">
                <span>Amount Paid:</span>
                <span>${formatDisplayCurrency(totals.amountPaid, curr)}</span>
              </div>
              <div class="inv-classic-sum-row inv-classic-due-row">
                <span>Balance Due:</span>
                <span>${formatDisplayCurrency(totals.balanceDue, curr)}</span>
              </div>
            </div>
          </div>

          <div class="inv-classic-footer-bar">
            <div id="receipt-barcode-target" class="receipt-barcode-target"></div>
          </div>
        </div>
      `;
    },

    // --- TEMPLATE D: VINTAGE BENGALI TRADITIONAL MEMO / LEDGER ---
    generateBnVintageLedgerHtml(state, totals) {
      const s = state.seller;
      const b = state.buyer;
      const m = state.meta;
      const v = state.vintageBn || {};

      const bnDate = formatBengaliDate(m.issueDate, true);
      const bnMemoNo = m.docNumber; // in Confidential Regular font
      const wordsAmountStr = bengaliAmountInWords(totals.grandTotal, totals.decimals);

      // Split seller address into title/subtitle/phone
      const addrLines = (s.address || '').split('\n').filter(Boolean);
      const subTitle = addrLines[0] || '';
      const contactLine = addrLines.slice(1).join(' — ') || '';

      // Determine payment method text
      let paymentMethodText = 'নগদ ক্যাশ';
      if (state.settlement.method === 'COD') {
        paymentMethodText = 'ক্যাশ অন ডেলিভারি (COD)';
      } else if (state.settlement.method === 'MFS') {
        const prov = state.settlement.mfsProvider || 'বিকাশ';
        const parts = [];
        if (state.settlement.mfsNumber) parts.push(toBengaliNumerals(state.settlement.mfsNumber));
        if (state.settlement.trxId) parts.push('TrxID: ' + state.settlement.trxId);
        paymentMethodText = `এমএফএস (${prov})${parts.length ? ' — ' + parts.join(', ') : ''}`;
      } else if (state.settlement.method === 'TRANSFER') {
        paymentMethodText = 'ব্যাংক ট্রান্সফার';
      } else if (state.settlement.method === 'CARD') {
        paymentMethodText = `কার্ড পরিশোধ${state.settlement.last4 ? ' (**** ' + state.settlement.last4 + ')' : ''}`;
      } else if (state.settlement.method === 'CHECK') {
        paymentMethodText = 'চেক মারফত';
      } else if (state.settlement.terms && state.settlement.terms.includes('ক্যাশ')) {
        paymentMethodText = 'ক্যাশ অন ডেলিভারি (COD)';
      }

      let itemsRows = state.items.map((item, idx) => {
        const qty = Number(item.qty) || 0;
        const price = Math.round(Number(item.unitPrice) || 0);
        const base = Math.round(qty * price);
        const disc = item.discountType === 'percent'
          ? Math.round(base * ((Number(item.discount) || 0) / 100))
          : Math.min(base, Math.round(Number(item.discount) || 0));
        const lineTotal = base - disc;

        return `
          <tr class="inv-vbn-tr">
            <td class="inv-vbn-td text-center" style="width:38px;">${toBengaliNumerals(idx + 1)}</td>
            <td class="inv-vbn-td">
              <div class="inv-vbn-item-title">${renderVintageScript(item.name)}</div>
              ${item.description ? `<div class="inv-vbn-item-desc">${renderVintageScript(item.description)}</div>` : ''}
            </td>
            <td class="inv-vbn-td text-center" style="width:65px;">${toBengaliNumerals(qty)}</td>
            <td class="inv-vbn-td text-right" style="width:85px;">${toBengaliNumerals(formatMinorUnitsToInput(price, totals.decimals))}</td>
            <td class="inv-vbn-td text-right font-bold" style="width:100px;">${toBengaliNumerals(formatMinorUnitsToInput(lineTotal, totals.decimals))}</td>
          </tr>
        `;
      }).join('');

      return `
        <div class="inv-vbn-doc">
          <!-- Double Vertical Vermilion Red Guide Line -->
          <div class="inv-vbn-margin-line line-1"></div>
          <div class="inv-vbn-margin-line line-2"></div>

          <div class="inv-vbn-content-wrapper">
            <!-- Auspicious Invocation Header -->
            <div class="inv-vbn-invocation">
              ${escapeHTML(v.invocation || '॥ ৭ ॥')}
            </div>

            <!-- Shop Masthead -->
            <div class="inv-vbn-masthead">
              ${s.logoUrl ? `<img src="${s.logoUrl}" class="inv-vbn-logo" alt="লোগো">` : ''}
              <div class="inv-vbn-store-name">${escapeHTML(s.name)}</div>
              ${subTitle ? `<div class="inv-vbn-store-addr">${escapeHTML(subTitle)}</div>` : ''}
              ${contactLine ? `<div class="inv-vbn-store-contact">${escapeHTML(contactLine)}</div>` : ''}
              <div class="inv-vbn-head-divider"></div>
            </div>

            <!-- Customer & Memo Metadata Grid -->
            <div class="inv-vbn-memo-row">
              <span class="inv-vbn-memo-label">মেমো নং:</span>
              <span class="inv-vbn-memo-val font-confidential">${escapeHTML(bnMemoNo)}</span>
            </div>

            <div class="inv-vbn-field-line">
              <span class="inv-vbn-label">তারিখ:</span>
              <span class="inv-vbn-val">${escapeHTML(bnDate)}</span>
            </div>

            <div class="inv-vbn-field-line">
              <span class="inv-vbn-label">গ্রহীতার নাম:</span>
              <span class="inv-vbn-val">${renderVintageScript(b.name || '')}</span>
            </div>

            ${b.phone ? `
              <div class="inv-vbn-field-line">
                <span class="inv-vbn-label">মোবাইল নম্বর:</span>
                <span class="inv-vbn-val">${renderVintageScript(toBengaliNumerals(b.phone))}</span>
              </div>
            ` : ''}

            <div class="inv-vbn-field-line">
              <span class="inv-vbn-label">ঠিকানা:</span>
              <span class="inv-vbn-val">${renderVintageScript(b.address || '').replace(/\n/g, ', ')}</span>
            </div>

            <!-- Horizontal Slate-Blue Payment Status Banner -->
            <div class="inv-vbn-pay-banner">
              <span>মূল্য পরিশোধ:</span>
              <span>${escapeHTML(paymentMethodText)}</span>
            </div>

            <!-- Ledger Ruled Table -->
            <table class="inv-vbn-table">
              <thead>
                <tr>
                  <th class="inv-vbn-th text-center" style="width:38px;">ক্র.</th>
                  <th class="inv-vbn-th text-left">পণ্যের বিবরণ</th>
                  <th class="inv-vbn-th text-center" style="width:65px;">পরিমাণ</th>
                  <th class="inv-vbn-th text-right" style="width:85px;">দর</th>
                  <th class="inv-vbn-th text-right" style="width:100px;">মোট টাকা</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
            <div class="inv-vbn-table-footer-line"></div>

            <!-- Words & Totals Block -->
            <div class="inv-vbn-summary-grid">
              <div class="inv-vbn-words-block">
                ${v.showWordsAmount ? `
                  <div class="inv-vbn-words-amount font-bn-kobi">${wordsAmountStr}</div>
                ` : ''}
                ${state.settlement.terms ? `
                  <div class="inv-vbn-notes-block">
                    ${renderVintageScript(state.settlement.terms).replace(/\n/g, '<br>')}
                  </div>
                ` : ''}
              </div>

              <div class="inv-vbn-ledger-totals">
                <div class="inv-vbn-tot-row">
                  <span class="inv-vbn-tot-lbl">মোট মূল্য:</span>
                  <span class="inv-vbn-tot-val font-bold">৳ ${toBengaliNumerals(formatMinorUnitsToInput(totals.subtotal, totals.decimals))}</span>
                </div>
                ${totals.shipping > 0 ? `
                  <div class="inv-vbn-tot-row">
                    <span class="inv-vbn-tot-lbl">ডেলিভারি চার্জ:</span>
                    <span class="inv-vbn-tot-val">৳ ${toBengaliNumerals(formatMinorUnitsToInput(totals.shipping, totals.decimals))}</span>
                  </div>
                ` : ''}
                ${totals.globalDiscount > 0 ? `
                  <div class="inv-vbn-tot-row">
                    <span class="inv-vbn-tot-lbl">কমিশন / ছাড়:</span>
                    <span class="inv-vbn-tot-val">- ৳ ${toBengaliNumerals(formatMinorUnitsToInput(totals.globalDiscount, totals.decimals))}</span>
                  </div>
                ` : ''}
                <div class="inv-vbn-tot-row inv-vbn-grand-row">
                  <span class="inv-vbn-grand-lbl">সর্বমোট:</span>
                  <span class="inv-vbn-grand-val">৳ ${toBengaliNumerals(formatMinorUnitsToInput(totals.grandTotal, totals.decimals))}</span>
                </div>
                ${totals.amountPaid > 0 && totals.amountPaid !== totals.grandTotal ? `
                  <div class="inv-vbn-tot-row">
                    <span class="inv-vbn-tot-lbl">পরিশোধিত:</span>
                    <span class="inv-vbn-tot-val">৳ ${toBengaliNumerals(formatMinorUnitsToInput(totals.amountPaid, totals.decimals))}</span>
                  </div>
                ` : ''}
                ${totals.balanceDue > 0 ? `
                  <div class="inv-vbn-tot-row">
                    <span class="inv-vbn-tot-lbl" style="color:#b71c1c;">বাকি / দেনা:</span>
                    <span class="inv-vbn-tot-val font-bold" style="color:#b71c1c;">৳ ${toBengaliNumerals(formatMinorUnitsToInput(totals.balanceDue, totals.decimals))}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Bottom Authentic Divider Rule -->
            <div class="inv-vbn-divider-bottom"></div>

            <!-- Authenticity Elements: Stamp & Signature -->
            <div class="inv-vbn-bottom-authentic">
              <div class="inv-vbn-stamp-zone">
                ${v.showSeal ? generateVintageRevenueStampSvg(v.sealText || 'পরিশোধিত', s.name || 'মেসার্স ট্রেডার্স') : ''}
                <div id="receipt-barcode-target" class="receipt-barcode-target vbn-barcode"></div>
              </div>

              <div class="inv-vbn-sig-zone">
                ${v.showSignature ? `
                  <div class="inv-vbn-signature-wrap">
                    <div class="inv-vbn-sig-cursive font-bn-kobi">${escapeHTML(v.signatureTitle || 'কোষাধ্যক্ষ')}</div>
                    <div class="inv-vbn-sig-line"></div>
                    <div class="inv-vbn-sig-label">${escapeHTML(v.signatureTitle || 'কোষাধ্যক্ষ')}</div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // --- TEMPLATE E: CONTINUOUS TRACTOR-FEED / DOT-MATRIX (1960s-1980s) ---
    generateMidCenturyTractorHtml(state, totals) {
      const m = state.meta;
      const s = state.seller;
      const b = state.buyer;
      const curr = m.currency;

      let itemsRows = state.items.map((item, idx) => {
        const qty = Number(item.qty) || 0;
        const price = Math.round(Number(item.unitPrice) || 0);
        const base = Math.round(qty * price);
        const disc = item.discountType === 'percent'
          ? Math.round(base * ((Number(item.discount) || 0) / 100))
          : Math.min(base, Math.round(Number(item.discount) || 0));
        const lineTotal = base - disc;

        return `
          <tr class="inv-tractor-tr">
            <td class="inv-tractor-td text-center" style="width:40px;">${String(idx + 1).padStart(2, '0')}</td>
            <td class="inv-tractor-td">
              <div class="inv-tractor-item-title">${escapeHTML(item.name).toUpperCase()}</div>
              ${item.description ? `<div class="inv-tractor-item-desc">${escapeHTML(item.description).toUpperCase()}</div>` : ''}
            </td>
            <td class="inv-tractor-td text-center" style="width:60px;">${qty}</td>
            <td class="inv-tractor-td text-right" style="width:95px;">${formatDisplayCurrency(price, curr)}</td>
            <td class="inv-tractor-td text-right" style="width:65px;">${item.taxRate ? item.taxRate + '%' : '0%'}</td>
            <td class="inv-tractor-td text-right font-bold" style="width:110px;">${formatDisplayCurrency(lineTotal, curr)}</td>
          </tr>
        `;
      }).join('');

      const termsFirstLine = state.settlement.terms ? state.settlement.terms.split('\n')[0] : 'NET 30 DAYS';

      return `
        <div class="inv-tractor-doc">
          <!-- Continuous tractor-feed sprocket hole strips -->
          <div class="inv-tractor-sprocket-col left">
            <div class="inv-tractor-holes"></div>
            <div class="inv-tractor-perf-line"></div>
          </div>
          <div class="inv-tractor-sprocket-col right">
            <div class="inv-tractor-perf-line"></div>
            <div class="inv-tractor-holes"></div>
          </div>

          <div class="inv-tractor-body">
            <!-- Masthead / Top Area -->
            <div class="inv-tractor-header">
              <div class="inv-tractor-brand">
                ${s.logoUrl ? `<img src="${s.logoUrl}" class="inv-tractor-logo" alt="logo">` : ''}
                <div class="inv-tractor-store-name">${escapeHTML(s.name || 'INDUSTRIAL WHOLESALE SUPPLY').toUpperCase()}</div>
                <div class="inv-tractor-address">${escapeHTML(s.address || '').toUpperCase().replace(/\n/g, '<br>')}</div>
                ${s.taxId ? `<div class="inv-tractor-meta-field"><span class="inv-tractor-fld-lbl">FED TAX ID:</span> ${escapeHTML(s.taxId).toUpperCase()}</div>` : ''}
                ${s.cashier ? `<div class="inv-tractor-meta-field"><span class="inv-tractor-fld-lbl">DISPATCH:</span> ${escapeHTML(s.cashier).toUpperCase()}</div>` : ''}
              </div>

              <div class="inv-tractor-top-right">
                <!-- Mechanical red numbering stamp in top-right corner -->
                <div class="inv-tractor-stamp">
                  <span class="inv-tractor-stamp-prefix">NO.</span>
                  <span class="inv-tractor-stamp-num">${escapeHTML(m.docNumber || '000000').toUpperCase()}</span>
                </div>

                <!-- Pre-printed checkbox block for multi-part copies -->
                <div class="inv-tractor-multipart">
                  <span class="inv-tractor-copy-item ${m.docType === 'invoice' || !m.docType ? 'is-active' : ''}">[${m.docType === 'invoice' || !m.docType ? 'X' : '&nbsp;'}] CUSTOMER INVOICE</span>
                  <span class="inv-tractor-copy-item ${m.docType === 'receipt' ? 'is-active' : ''}">[${m.docType === 'receipt' ? 'X' : '&nbsp;'}] CASH RECEIPT</span>
                  <span class="inv-tractor-copy-item">[&nbsp;] FILE COPY</span>
                  <span class="inv-tractor-copy-item">[&nbsp;] ACCOUNTING COPY</span>
                </div>

                <!-- Date & Order Reference -->
                <div class="inv-tractor-date-box">
                  <div class="inv-tractor-date-row">
                    <span class="inv-tractor-fld-lbl">DATE:</span>
                    <span class="inv-tractor-fld-val">${escapeHTML(m.issueDate)}</span>
                  </div>
                  ${m.dueDate && m.docType !== 'receipt' ? `
                    <div class="inv-tractor-date-row">
                      <span class="inv-tractor-fld-lbl">PAY DUE:</span>
                      <span class="inv-tractor-fld-val">${escapeHTML(m.dueDate)}</span>
                    </div>
                  ` : ''}
                  ${b.poNumber ? `
                    <div class="inv-tractor-date-row">
                      <span class="inv-tractor-fld-lbl">P.O. NO.:</span>
                      <span class="inv-tractor-fld-val">${escapeHTML(b.poNumber).toUpperCase()}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Solid double-line divider -->
            <div class="inv-tractor-divider-double"></div>

            <!-- Billing & Shipping Parties (Uppercase field labels with fixed-pitch character spacing) -->
            <div class="inv-tractor-parties">
              <div class="inv-tractor-party-card">
                <div class="inv-tractor-party-hdr">SOLD TO / BILLING:</div>
                <div class="inv-tractor-party-name">${escapeHTML(b.name || 'CASH CUSTOMER').toUpperCase()}</div>
                <div class="inv-tractor-party-addr">${escapeHTML(b.address || '').toUpperCase().replace(/\n/g, '<br>')}</div>
                ${b.phone ? `<div class="inv-tractor-party-sub"><span class="inv-tractor-fld-lbl">PHONE:</span> ${escapeHTML(b.phone)}</div>` : ''}
                ${b.taxId ? `<div class="inv-tractor-party-sub"><span class="inv-tractor-fld-lbl">TAX EXEMPT:</span> ${escapeHTML(b.taxId).toUpperCase()}</div>` : ''}
              </div>
              <div class="inv-tractor-party-card">
                <div class="inv-tractor-party-hdr">SHIP TO / DESTINATION:</div>
                <div class="inv-tractor-party-name">${escapeHTML(b.name || 'SAME AS BILLING').toUpperCase()}</div>
                <div class="inv-tractor-party-addr">${escapeHTML(b.address || 'DELIVER TO DOCK / SITE LOCATION').toUpperCase().replace(/\n/g, '<br>')}</div>
                <div class="inv-tractor-party-sub"><span class="inv-tractor-fld-lbl">METHOD:</span> ${escapeHTML(state.settlement.method || 'STANDARD TRUCK FREIGHT')}</div>
              </div>
            </div>

            <!-- Order Routing Spec Strip -->
            <div class="inv-tractor-order-strip">
              <div class="inv-tractor-strip-col"><span class="inv-tractor-fld-lbl">CUSTOMER P.O.</span><span class="inv-tractor-strip-val">${escapeHTML(b.poNumber || 'N/A').toUpperCase()}</span></div>
              <div class="inv-tractor-strip-col"><span class="inv-tractor-fld-lbl">ORDER DATE</span><span class="inv-tractor-strip-val">${escapeHTML(m.issueDate)}</span></div>
              <div class="inv-tractor-strip-col"><span class="inv-tractor-fld-lbl">TERMS</span><span class="inv-tractor-strip-val">${escapeHTML(termsFirstLine).toUpperCase()}</span></div>
              <div class="inv-tractor-strip-col"><span class="inv-tractor-fld-lbl">F.O.B. POINT</span><span class="inv-tractor-strip-val">ORIGIN / FACTORY</span></div>
            </div>

            <!-- Solid double-line divider -->
            <div class="inv-tractor-divider-double"></div>

            <!-- Continuous Green-Bar / Pale Blue-Bar Item Table -->
            <table class="inv-tractor-table">
              <thead>
                <tr>
                  <th class="inv-tractor-th text-center" style="width:40px;">ITEM</th>
                  <th class="inv-tractor-th text-left">DESCRIPTION OF GOODS</th>
                  <th class="inv-tractor-th text-center" style="width:60px;">QTY</th>
                  <th class="inv-tractor-th text-right" style="width:95px;">PRICE</th>
                  <th class="inv-tractor-th text-right" style="width:65px;">TAX</th>
                  <th class="inv-tractor-th text-right" style="width:110px;">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <!-- Solid double-line divider -->
            <div class="inv-tractor-divider-double"></div>

            <!-- Bottom Settlement, Barcode & Totals Section -->
            <div class="inv-tractor-bottom-grid">
              <div class="inv-tractor-bottom-left">
                ${state.settlement.bankDetails ? `
                  <div class="inv-tractor-block">
                    <div class="inv-tractor-block-lbl">REMITTANCE INSTRUCTIONS:</div>
                    <div class="inv-tractor-block-val">${escapeHTML(state.settlement.bankDetails).toUpperCase().replace(/\n/g, '<br>')}</div>
                  </div>
                ` : ''}
                ${state.settlement.terms ? `
                  <div class="inv-tractor-block">
                    <div class="inv-tractor-block-lbl">POLICY &amp; CONDITIONS:</div>
                    <div class="inv-tractor-block-val">${escapeHTML(state.settlement.terms).toUpperCase().replace(/\n/g, '<br>')}</div>
                  </div>
                ` : ''}
                <div id="receipt-barcode-target" class="receipt-barcode-target tractor-barcode"></div>
              </div>

              <!-- Monospace Totals Ledger -->
              <div class="inv-tractor-totals-box">
                <div class="inv-tractor-tot-row">
                  <span class="inv-tractor-tot-lbl">SUBTOTAL</span>
                  <span class="inv-tractor-tot-val">${formatDisplayCurrency(totals.subtotal, curr)}</span>
                </div>
                ${totals.discountTotal > 0 ? `
                  <div class="inv-tractor-tot-row">
                    <span class="inv-tractor-tot-lbl">LESS DISCOUNT</span>
                    <span class="inv-tractor-tot-val">-${formatDisplayCurrency(totals.discountTotal, curr)}</span>
                  </div>
                ` : ''}
                ${totals.taxTotal > 0 ? `
                  <div class="inv-tractor-tot-row">
                    <span class="inv-tractor-tot-lbl">SALES TAX</span>
                    <span class="inv-tractor-tot-val">${formatDisplayCurrency(totals.taxTotal, curr)}</span>
                  </div>
                ` : ''}
                ${totals.shipping > 0 ? `
                  <div class="inv-tractor-tot-row">
                    <span class="inv-tractor-tot-lbl">FREIGHT / POST</span>
                    <span class="inv-tractor-tot-val">${formatDisplayCurrency(totals.shipping, curr)}</span>
                  </div>
                ` : ''}
                
                <div class="inv-tractor-divider-double" style="margin: 4px 0;"></div>

                <div class="inv-tractor-tot-row inv-tractor-grand-row">
                  <span class="inv-tractor-grand-lbl">TOTAL AMOUNT</span>
                  <span class="inv-tractor-grand-val">${formatDisplayCurrency(totals.grandTotal, curr)}</span>
                </div>

                ${totals.amountPaid > 0 ? `
                  <div class="inv-tractor-tot-row">
                    <span class="inv-tractor-tot-lbl">AMOUNT PAID</span>
                    <span class="inv-tractor-tot-val">${formatDisplayCurrency(totals.amountPaid, curr)}</span>
                  </div>
                ` : ''}

                <div class="inv-tractor-tot-row inv-tractor-due-row">
                  <span class="inv-tractor-due-lbl">BALANCE DUE</span>
                  <span class="inv-tractor-due-val">${formatDisplayCurrency(totals.balanceDue, curr)}</span>
                </div>
              </div>
            </div>

            <div class="inv-tractor-footer-rule"></div>
            <div class="inv-tractor-footer-banner">
              <span>* * * CONTINUOUS FORM #408 - RETAIN FOR INDUSTRIAL AUDIT &amp; TAX RECORDS * * *</span>
            </div>
          </div>
        </div>
      `;
    },

    // --- TEMPLATE F: ENTERPRISE ERP / LATE-90S CORPORATE ---
    generateErpClassic90sHtml(state, totals) {
      const m = state.meta;
      const s = state.seller;
      const b = state.buyer;
      const curr = m.currency;

      const docTypeName = m.docType === 'receipt' ? 'RECEIPT'
        : m.docType === 'tax-invoice' ? 'TAX INVOICE'
          : m.docType === 'pro-forma' ? 'PRO FORMA'
            : 'INVOICE';

      let itemsRows = state.items.map((item, idx) => {
        const qty = Number(item.qty) || 0;
        const price = Math.round(Number(item.unitPrice) || 0);
        const base = Math.round(qty * price);
        const disc = item.discountType === 'percent'
          ? Math.round(base * ((Number(item.discount) || 0) / 100))
          : Math.min(base, Math.round(Number(item.discount) || 0));
        const lineTotal = base - disc;

        return `
          <tr class="inv-erp-tr">
            <td class="inv-erp-td text-center" style="width:45px;">${idx + 1}</td>
            <td class="inv-erp-td text-center" style="width:90px;">${escapeHTML(item.id || ('ITM-' + (idx + 1)))}</td>
            <td class="inv-erp-td">
              <div class="inv-erp-item-name">${escapeHTML(item.name)}</div>
              ${item.description ? `<div class="inv-erp-item-desc">${escapeHTML(item.description)}</div>` : ''}
            </td>
            <td class="inv-erp-td text-right" style="width:60px;">${qty}</td>
            <td class="inv-erp-td text-right" style="width:95px;">${formatDisplayCurrency(price, curr)}</td>
            <td class="inv-erp-td text-right" style="width:65px;">${item.taxRate ? item.taxRate + '%' : '0%'}</td>
            <td class="inv-erp-td text-right font-bold" style="width:110px;">${formatDisplayCurrency(lineTotal, curr)}</td>
          </tr>
        `;
      }).join('');

      // ERP classic grid pre-printed rows: if few items, add blank grid rows to fill the table grid authentically
      const minRows = 5;
      if (state.items.length < minRows) {
        for (let r = state.items.length; r < minRows; r++) {
          itemsRows += `
            <tr class="inv-erp-tr inv-erp-empty-row">
              <td class="inv-erp-td">&nbsp;</td>
              <td class="inv-erp-td">&nbsp;</td>
              <td class="inv-erp-td">&nbsp;</td>
              <td class="inv-erp-td">&nbsp;</td>
              <td class="inv-erp-td">&nbsp;</td>
              <td class="inv-erp-td">&nbsp;</td>
              <td class="inv-erp-td">&nbsp;</td>
            </tr>
          `;
        }
      }

      const termsFirstLine = state.settlement.terms ? state.settlement.terms.split('\n')[0] : 'Net 30 Days';
      const repName = s.cashier || s.terminalId || 'SALES REP';
      const shipVia = 'UPS GROUND';
      const fobPoint = 'DESTINATION';

      return `
        <div class="inv-erp-doc">
          <!-- Top Header / Masthead -->
          <div class="inv-erp-header">
            <div class="inv-erp-brand">
              ${s.logoUrl ? `<img src="${s.logoUrl}" class="inv-erp-logo" alt="logo">` : ''}
              <div class="inv-erp-store-name">${escapeHTML(s.name || 'GLOBAL ENTERPRISE CORP.')}</div>
              <div class="inv-erp-store-addr">${escapeHTML(s.address || '').replace(/\n/g, '<br>')}</div>
              ${s.taxId ? `<div class="inv-erp-store-meta">Tax ID / EIN: ${escapeHTML(s.taxId)}</div>` : ''}
              ${s.email ? `<div class="inv-erp-store-meta">Email: ${escapeHTML(s.email)}</div>` : ''}
            </div>

            <div class="inv-erp-masthead-right">
              <div class="inv-erp-doc-title-bar">${docTypeName}</div>
              <!-- Boxed Document Meta Table -->
              <table class="inv-erp-meta-box">
                <thead>
                  <tr>
                    <th class="inv-erp-meta-th">DATE</th>
                    <th class="inv-erp-meta-th">INVOICE NO.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="inv-erp-meta-td">${escapeHTML(m.issueDate)}</td>
                    <td class="inv-erp-meta-td font-bold">${escapeHTML(m.docNumber)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Rigid Boxed Entity Layout (Explicit 1px bordered rectangle cells) -->
          <div class="inv-erp-entity-row">
            <div class="inv-erp-entity-box">
              <div class="inv-erp-box-hdr">BILL TO</div>
              <div class="inv-erp-box-body">
                <div class="inv-erp-client-name">${escapeHTML(b.name || 'Client Corporation')}</div>
                <div class="inv-erp-client-addr">${escapeHTML(b.address || '').replace(/\n/g, '<br>')}</div>
                ${b.phone ? `<div class="inv-erp-client-sub">Phone: ${escapeHTML(b.phone)}</div>` : ''}
                ${b.taxId ? `<div class="inv-erp-client-sub">Tax ID: ${escapeHTML(b.taxId)}</div>` : ''}
              </div>
            </div>

            <div class="inv-erp-entity-box">
              <div class="inv-erp-box-hdr">SHIP TO</div>
              <div class="inv-erp-box-body">
                <div class="inv-erp-client-name">${escapeHTML(b.name || 'Client Corporation')}</div>
                <div class="inv-erp-client-addr">${escapeHTML(b.address || 'Same as Billing Address').replace(/\n/g, '<br>')}</div>
                <div class="inv-erp-client-sub">Attn: Receiving Dept / Dock</div>
              </div>
            </div>
          </div>

          <!-- Rigid Boxed Order Metadata Bar (P.O. Number, Terms, Rep, Ship Via) -->
          <table class="inv-erp-order-meta-grid">
            <thead>
              <tr>
                <th class="inv-erp-order-th">P.O. NUMBER</th>
                <th class="inv-erp-order-th">TERMS</th>
                <th class="inv-erp-order-th">REP</th>
                <th class="inv-erp-order-th">SHIP VIA</th>
                <th class="inv-erp-order-th">F.O.B.</th>
                <th class="inv-erp-order-th">DUE DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="inv-erp-order-td">${escapeHTML(b.poNumber || 'N/A')}</td>
                <td class="inv-erp-order-td">${escapeHTML(termsFirstLine)}</td>
                <td class="inv-erp-order-td">${escapeHTML(repName)}</td>
                <td class="inv-erp-order-td">${escapeHTML(shipVia)}</td>
                <td class="inv-erp-order-td">${escapeHTML(fobPoint)}</td>
                <td class="inv-erp-order-td">${escapeHTML(m.dueDate || m.issueDate)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Full-Grid Item Table with active vertical and horizontal cell borders -->
          <table class="inv-erp-grid-table">
            <thead>
              <tr>
                <th class="inv-erp-th text-center" style="width:45px;">LINE</th>
                <th class="inv-erp-th text-center" style="width:90px;">ITEM CODE</th>
                <th class="inv-erp-th text-left">DESCRIPTION</th>
                <th class="inv-erp-th text-right" style="width:60px;">QTY</th>
                <th class="inv-erp-th text-right" style="width:95px;">RATE</th>
                <th class="inv-erp-th text-right" style="width:65px;">TAX</th>
                <th class="inv-erp-th text-right" style="width:110px;">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- Settlement & Boxed Totals Module -->
          <div class="inv-erp-mid-summary">
            <div class="inv-erp-summary-left">
              ${state.settlement.bankDetails ? `
                <div class="inv-erp-notes-box">
                  <div class="inv-erp-notes-title">REMITTANCE &amp; WIRE INSTRUCTIONS:</div>
                  <div class="inv-erp-notes-body">${escapeHTML(state.settlement.bankDetails).replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
              ${state.settlement.terms ? `
                <div class="inv-erp-notes-box">
                  <div class="inv-erp-notes-title">TERMS &amp; CONDITIONS:</div>
                  <div class="inv-erp-notes-body">${escapeHTML(state.settlement.terms).replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
              <div id="receipt-barcode-target" class="receipt-barcode-target erp-barcode"></div>
            </div>

            <table class="inv-erp-totals-grid">
              <tbody>
                <tr>
                  <td class="inv-erp-tot-lbl">SUBTOTAL</td>
                  <td class="inv-erp-tot-val">${formatDisplayCurrency(totals.subtotal, curr)}</td>
                </tr>
                ${totals.discountTotal > 0 ? `
                  <tr>
                    <td class="inv-erp-tot-lbl">DISCOUNT</td>
                    <td class="inv-erp-tot-val">-${formatDisplayCurrency(totals.discountTotal, curr)}</td>
                  </tr>
                ` : ''}
                ${totals.taxTotal > 0 ? `
                  <td class="inv-erp-tot-lbl">SALES TAX</td>
                  <td class="inv-erp-tot-val">${formatDisplayCurrency(totals.taxTotal, curr)}</td>
                ` : ''}
                ${totals.shipping > 0 ? `
                  <tr>
                    <td class="inv-erp-tot-lbl">SHIPPING &amp; HANDLING</td>
                    <td class="inv-erp-tot-val">${formatDisplayCurrency(totals.shipping, curr)}</td>
                  </tr>
                ` : ''}
                <tr class="inv-erp-total-row">
                  <td class="inv-erp-tot-lbl font-bold">TOTAL INVOICE</td>
                  <td class="inv-erp-tot-val font-bold">${formatDisplayCurrency(totals.grandTotal, curr)}</td>
                </tr>
                ${totals.amountPaid > 0 ? `
                  <tr>
                    <td class="inv-erp-tot-lbl">PAYMENTS APPLIED</td>
                    <td class="inv-erp-tot-val">-${formatDisplayCurrency(totals.amountPaid, curr)}</td>
                  </tr>
                ` : ''}
                <tr class="inv-erp-due-row">
                  <td class="inv-erp-tot-lbl font-bold">BALANCE DUE</td>
                  <td class="inv-erp-tot-val font-bold">${formatDisplayCurrency(totals.balanceDue, curr)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bottom Remittance Slip with scissors icon and dashed detachment line -->
          <div class="inv-erp-remittance-wrap">
            <div class="inv-erp-detach-line">
              <span>--- &#9986; PLEASE DETACH HERE AND RETURN WITH PAYMENT ---</span>
            </div>
            <div class="inv-erp-remittance-slip">
              <div class="inv-erp-slip-header">
                <span class="inv-erp-slip-title">REMITTANCE ADVICE</span>
                <span class="inv-erp-slip-doc">${escapeHTML(m.docNumber)}</span>
              </div>
              <div class="inv-erp-slip-grid">
                <div class="inv-erp-slip-col">
                  <div class="inv-erp-slip-lbl">CUSTOMER:</div>
                  <div class="inv-erp-slip-val font-bold">${escapeHTML(b.name || 'Valued Customer')}</div>
                  <div class="inv-erp-slip-sub">${escapeHTML(b.address || '').split('\n')[0]}</div>
                </div>
                <div class="inv-erp-slip-col">
                  <div class="inv-erp-slip-lbl">INVOICE DATE:</div>
                  <div class="inv-erp-slip-val">${escapeHTML(m.issueDate)}</div>
                  <div class="inv-erp-slip-lbl" style="margin-top:4px;">DUE DATE:</div>
                  <div class="inv-erp-slip-val">${escapeHTML(m.dueDate || m.issueDate)}</div>
                </div>
                <div class="inv-erp-slip-col">
                  <div class="inv-erp-slip-lbl">AMOUNT DUE:</div>
                  <div class="inv-erp-slip-val font-bold inv-erp-due-text">${formatDisplayCurrency(totals.balanceDue, curr)}</div>
                </div>
                <div class="inv-erp-slip-col inv-erp-slip-box">
                  <div class="inv-erp-slip-lbl">AMOUNT ENCLOSED:</div>
                  <div class="inv-erp-enclosed-line">$ ____________________</div>
                </div>
              </div>
              <div class="inv-erp-slip-footer">
                <span>REMIT TO: <strong>${escapeHTML(s.name)}</strong> &bull; ${escapeHTML(s.address.split('\n')[0])}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // --- TEMPLATE G: ENTERPRISE SUPERMARKET / NBR CHALLAN (MUSHAK-6.3) ---
    generateThermalRetailMushakHtml(state, totals) {
      const s = state.seller;
      const m = state.meta;
      const b = state.buyer;
      const is58 = m.thermalWidth === '58mm';
      const colWidth = is58 ? 32 : 56;
      const divider = '-'.repeat(colWidth);

      const fmtMoney = (cents) => {
        const val = (Number(cents) || 0) / 100;
        return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };

      // Line items: 5-column tabular grid
      let itemsRowsHtml = state.items.map((item, idx) => {
        const qty = Number(item.qty) || 0;
        const price = Math.round(Number(item.unitPrice) || 0);
        const base = Math.round(qty * price);
        const qtyStr = (qty % 1 === 0) ? qty.toFixed(2) : qty.toString();
        const priceStr = fmtMoney(price);
        const totalStr = fmtMoney(base);

        return `
          <tr class="inv-mushak-tr">
            <td class="inv-mushak-td td-sl">${idx + 1}</td>
            <td class="inv-mushak-td td-desc">${escapeHTML(item.name)}</td>
            <td class="inv-mushak-td td-price">${priceStr}</td>
            <td class="inv-mushak-td td-qty">${qtyStr}</td>
            <td class="inv-mushak-td td-total">${totalStr}</td>
          </tr>
        `;
      }).join('');

      // Rounding string
      let roundingStr = '0.00';
      if (totals.rounding < 0) {
        roundingStr = '-' + fmtMoney(Math.abs(totals.rounding));
      } else if (totals.rounding > 0) {
        roundingStr = '+' + fmtMoney(totals.rounding);
      }

      // Tax lines
      let taxRowsHtml = '';
      if (totals.totalTax > 0) {
        taxRowsHtml = Object.keys(totals.taxBuckets).map(rate => {
          const taxAmt = totals.taxBuckets[rate];
          const rateNum = parseFloat(rate);
          const baseStr = fmtMoney(totals.taxableBase);
          const amtStr = fmtMoney(taxAmt);
          const withTaxTotal = totals.taxableBase + taxAmt;
          return `
            <div class="inv-mushak-ledg-row">
              <span class="inv-mushak-ledg-lbl">${rateNum}% VAT on ${baseStr} :</span>
              <span class="inv-mushak-ledg-val">${amtStr}</span>
            </div>
            <div class="inv-mushak-ledg-subdiv">---------------------</div>
            <div class="inv-mushak-ledg-row">
              <span class="inv-mushak-ledg-lbl">&nbsp;</span>
              <span class="inv-mushak-ledg-val">${fmtMoney(withTaxTotal)}</span>
            </div>
          `;
        }).join('');
      }

      // Payment Tender Line
      let tenderLabel = 'CASH PAID';
      let tenderAmount = totals.tendered || totals.netPayable;
      if (state.settlement.method === 'TRANSFER') {
        tenderLabel = 'eCom Online';
      } else if (state.settlement.method === 'MFS') {
        const prov = state.settlement.mfsProvider || 'MFS';
        tenderLabel = escapeHTML(prov);
      } else if (state.settlement.method === 'CARD') {
        tenderLabel = 'CARD PAID';
      } else if (state.settlement.method === 'COD') {
        tenderLabel = 'COD PAYABLE';
      }

      // Discount Breakdown Module
      let discountBreakdownHtml = '';
      const discountedItems = state.items
        .map((item, idx) => {
          const qty = Number(item.qty) || 0;
          const price = Math.round(Number(item.unitPrice) || 0);
          const base = Math.round(qty * price);
          const disc = item.discountType === 'percent'
            ? Math.round(base * ((Number(item.discount) || 0) / 100))
            : Math.min(base, Math.round(Number(item.discount) || 0));
          return { sl: idx + 1, name: item.name, disc };
        })
        .filter(it => it.disc > 0);

      if (discountedItems.length > 0 || totals.discountTotal > 0) {
        discountBreakdownHtml = `
          <div class="inv-mushak-disc-module">
            <div class="inv-mushak-disc-title">** DISCOUNT ITEMS **</div>
            <div class="inv-mushak-divider">${divider}</div>
            <table class="inv-mushak-disc-table">
              <tbody>
                ${discountedItems.map(it => `
                  <tr>
                    <td class="td-disc-sl">${it.sl}</td>
                    <td class="td-disc-name">${escapeHTML(it.name)}</td>
                    <td class="td-disc-amt">${fmtMoney(it.disc)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="inv-mushak-divider">${divider}</div>
            <div class="inv-mushak-savings-row">
              <span>Your total savings today TK. :</span>
              <span class="savings-amt">${fmtMoney(totals.discountTotal)}</span>
            </div>
          </div>
          <div class="inv-mushak-divider">${divider}</div>
        `;
      }

      // Loyalty Points Module
      let loyaltyLedgerHtml = '';
      const loy = state.loyalty;
      if (loy && loy.enabled !== false && (loy.previousPoints !== undefined || loy.earnedPoints !== undefined)) {
        const prev = Number(loy.previousPoints) || 0;
        const earned = Number(loy.earnedPoints) || 0;
        const balance = prev + earned;
        loyaltyLedgerHtml = `
          <div class="inv-mushak-loyalty-module">
            <div class="inv-mushak-loyalty-title">Loyalty Points (as on ${escapeHTML(m.issueDate)})</div>
            <div class="inv-mushak-divider">${divider}</div>
            <div class="inv-mushak-loy-row">
              <span>Previous Points :</span>
              <span>${prev}</span>
            </div>
            <div class="inv-mushak-loy-row">
              <span>This Invoice :</span>
              <span>${earned}</span>
            </div>
            <div class="inv-mushak-loy-row">
              <span>Balance Points :</span>
              <span>${balance}</span>
            </div>
          </div>
          <div class="inv-mushak-divider">${divider}</div>
        `;
      }

      // Statutory Footer Notes
      const defaultNotes = `**VAT against this challan is
payable through central registration
Join the DREAM FACTORY at:
FACEBOOK.COM/GROUPS/SHWAPNOHELP
Thank you for shopping with SHWAPNO
Please visit www.shwapno.com for home delivery.
Purchase of defected item must be exchanged
by 24 hours with invoice.
For any queries, suggestions or complaints,
please call 16469 (9:00 AM - 6:00 PM)

Powered by MIS@ACI Limited`;

      const termsText = (state.settlement.terms && state.settlement.terms.trim()) ? state.settlement.terms : defaultNotes;

      return `
        <div class="inv-mushak-doc ${is58 ? 'mode-58mm' : 'mode-80mm'}">
          <!-- 1. STATUTORY AUTHORITY HEADER -->
          <div class="inv-mushak-top-auth">
            <div class="inv-mushak-chln-tag">Mushak - 6.3</div>
            <div class="inv-mushak-header-center">
              <div class="inv-mushak-gov-line">Government of the People's Republic of Bangladesh</div>
              <div class="inv-mushak-nbr-line">National Board of Revenue</div>
              <div class="inv-mushak-brand-name">${escapeHTML(s.name || 'SHWAPNO')}</div>
              <div class="inv-mushak-company-name">${escapeHTML(s.companyName || 'ACI Logistics Limited')}</div>
              <div class="inv-mushak-reg-addr">Registered Address: ${escapeHTML(s.registeredAddress || '270, Tejgaon I/A, Dhaka-1208')}</div>
              <div class="inv-mushak-vat-no">Central VAT Reg. No. : ${escapeHTML(s.taxId || '000005489-0203')}</div>
              <div class="inv-mushak-outlet-name">${escapeHTML(s.outletName || 'D006-Dhaka Malibag Mor Outlet')}</div>
              <div class="inv-mushak-outlet-addr">${escapeHTML(s.outletAddress || '260/6, Malibag, Dhaka')}</div>
            </div>
            <div class="inv-mushak-retail-banner">----------------------- RETAIL INVOICE ----------------------</div>
          </div>

          <!-- 2. METADATA GRID -->
          <div class="inv-mushak-meta-block">
            <div class="inv-mushak-meta-row">
              <span>Cashier : ${escapeHTML(s.cashier || '18821')}</span>
              <span>Terminal ID : ${escapeHTML(s.terminalId || 'D094POS1N')}</span>
            </div>
            <div class="inv-mushak-meta-row">
              <span>Invoice Number : ${escapeHTML(m.docNumber)}</span>
              <span>Date : ${escapeHTML(m.issueDate)}</span>
            </div>
            ${(b.phone || (b.name && b.name !== 'Cash Customer')) ? `
              <div class="inv-mushak-cust-row">
                <span>Customer ID : ${escapeHTML(b.phone || b.name)}</span>
              </div>
            ` : ''}
            <div class="inv-mushak-divider">${divider}</div>
            <div class="inv-mushak-promo-note">To Enjoy special Discounts Please register as a loyalty customer.</div>
            <div class="inv-mushak-divider">${divider}</div>
          </div>

          <!-- 3. 5-COLUMN TABULAR LINE ITEMS -->
          <table class="inv-mushak-table">
            <thead>
              <tr class="inv-mushak-th-row">
                <th class="inv-mushak-th th-sl">SL</th>
                <th class="inv-mushak-th th-desc">Item Description</th>
                <th class="inv-mushak-th th-price">Unit Price</th>
                <th class="inv-mushak-th th-qty">Qty</th>
                <th class="inv-mushak-th th-total">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <div class="inv-mushak-divider">${divider}</div>

          <!-- 4. FINANCIAL & SETTLEMENT LEDGER -->
          <div class="inv-mushak-ledger">
            <div class="inv-mushak-ledg-row">
              <span class="inv-mushak-ledg-lbl">Sub Total :</span>
              <span class="inv-mushak-ledg-val">${fmtMoney(totals.grossSubtotal)}</span>
            </div>
            <div class="inv-mushak-ledg-row">
              <span class="inv-mushak-ledg-lbl">(-) Discount :</span>
              <span class="inv-mushak-ledg-val">${fmtMoney(totals.discountTotal)}</span>
            </div>

            <div class="inv-mushak-ledg-subdiv">---------------------</div>
            <div class="inv-mushak-ledg-row">
              <span class="inv-mushak-ledg-lbl">&nbsp;</span>
              <span class="inv-mushak-ledg-val">${fmtMoney(totals.taxableBase)}</span>
            </div>

            ${taxRowsHtml}

            ${totals.shipping > 0 ? `
              <div class="inv-mushak-ledg-row">
                <span class="inv-mushak-ledg-lbl">Delivery Fee :</span>
                <span class="inv-mushak-ledg-val">${fmtMoney(totals.shipping)}</span>
              </div>
            ` : ''}

            <div class="inv-mushak-ledg-subdiv">---------------------</div>
            <div class="inv-mushak-ledg-row">
              <span class="inv-mushak-ledg-lbl">(+/-)Rounding :</span>
              <span class="inv-mushak-ledg-val">${roundingStr}</span>
            </div>

            <div class="inv-mushak-ledg-subdiv">---------------------</div>
            <div class="inv-mushak-ledg-row inv-mushak-net-row">
              <span class="inv-mushak-ledg-lbl">Net Payable :</span>
              <span class="inv-mushak-ledg-val">${fmtMoney(totals.netPayable)}</span>
            </div>
            <div class="inv-mushak-ledg-subdiv">---------------------</div>

            <div class="inv-mushak-ledg-row">
              <span class="inv-mushak-ledg-lbl">${tenderLabel} :</span>
              <span class="inv-mushak-ledg-val">${fmtMoney(tenderAmount)}</span>
            </div>
            ${(totals.change > 0 || state.settlement.method === 'CASH') ? `
              <div class="inv-mushak-ledg-row">
                <span class="inv-mushak-ledg-lbl">CHANGE AMOUNT :</span>
                <span class="inv-mushak-ledg-val">${fmtMoney(totals.change || 0)}</span>
              </div>
            ` : ''}
          </div>

          <div class="inv-mushak-divider">${divider}</div>

          <!-- 5. DISCOUNT BREAKDOWN TABLE -->
          ${discountBreakdownHtml}

          <!-- 6. LOYALTY LEDGER -->
          ${loyaltyLedgerHtml}

          <!-- 7. STATUTORY FOOTER NOTES -->
          <div class="inv-mushak-footer-notes">
            <div class="inv-mushak-foot-text">${escapeHTML(termsText).replace(/\n/g, '<br>')}</div>
          </div>

          <!-- 8. BARCODE TARGET -->
          <div id="receipt-barcode-target" class="receipt-barcode-target mushak-barcode"></div>
        </div>
      `;
    },

    // --- VECTOR PRINT & PDF EXPORT PIPELINE ---
    async downloadPdf() {
      const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      const html2canvasFn = window.html2canvas;
      if (!jsPDFClass || !html2canvasFn) {
        console.warn('PDF compiler libraries not loaded, falling back to print dialog');
        this.print();
        return;
      }

      // Ensure live preview DOM is completely fresh
      this.renderLivePreview();

      const paperTarget = document.getElementById('inv-paper-target');
      if (!paperTarget) return;

      const template = this.state.meta.template || 'stripe-modern';
      const isThermal = template === 'thermal-pos' || template === 'thermal-retail-mushak';
      const is58 = isThermal && this.state.meta.thermalWidth === '58mm';
      const isVintage = template === 'bn-vintage-ledger';
      const isTractor = template === 'mid-century-tractor';
      const docBg = isVintage ? '#fbf9f4' : (isTractor ? '#fbfbf7' : '#ffffff');
      const docNum = (this.state.meta.docNumber || 'document').trim().replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      const fileName = `${docNum}.pdf`;

      const pdfBtn = document.getElementById('inv-pdf-btn');
      const origBtnText = pdfBtn ? pdfBtn.innerHTML : '';
      if (pdfBtn) {
        pdfBtn.disabled = true;
        pdfBtn.textContent = '⏳ generating PDF...';
      }
      if (this.workbench && typeof this.workbench.setStatus === 'function') {
        this.workbench.setStatus('generating vector PDF...');
      }

      const scaler = document.getElementById('inv-canvas-scaler');
      const originalTransform = scaler ? scaler.style.transform : '';

      try {
        // Temporarily reset preview scaler transform so html2canvas captures 1:1 coordinates
        if (scaler) {
          scaler.style.transform = 'none';
        }
        paperTarget.classList.add('inv-exporting-pdf');

        // Allow microtask / DOM layout to settle
        await new Promise(r => setTimeout(r, 80));

        // High-DPI canvas capture using html2canvas
        const canvas = await html2canvasFn(paperTarget, {
          scale: 2, // 2x gives 300 DPI crisp, clean, vector-grade rendering
          useCORS: true,
          logging: false,
          backgroundColor: docBg,
          scrollX: 0,
          scrollY: 0
        });

        if (!canvas || !canvas.width || !canvas.height) {
          throw new Error('Canvas render failed or produced 0x0 output');
        }

        if (isThermal) {
          // --- THERMAL POS: Seamless Continuous Roll ---
          const thermalMm = is58 ? 58 : 80;
          const pageWidthPt = (thermalMm / 25.4) * 72; // ~164.41 pt (58mm) or ~226.77 pt (80mm)
          const pageHeightPt = (canvas.height * pageWidthPt) / canvas.width;

          const doc = new jsPDFClass({
            orientation: 'portrait',
            unit: 'pt',
            format: [pageWidthPt, pageHeightPt]
          });

          doc.addImage(canvas, 'PNG', 0, 0, pageWidthPt, pageHeightPt, undefined, 'FAST');
          doc.save(fileName);
        } else {
          // --- STANDARD A4 (Modern Digital, Minimal Classic, Vintage Bengali, Tractor Feed, ERP) ---
          const pageWidthPt = 595.28; // exact A4 pt width (210mm)
          const pageHeightPt = 841.89; // exact A4 pt height (297mm)
          const totalImgHeightPt = (canvas.height * pageWidthPt) / canvas.width;

          const doc = new jsPDFClass({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
          });

          // Single-page auto-fit threshold:
          // Invoices that naturally fit on 1 page or slightly spill over (up to 1.25x A4 height, ~1052 pt)
          // are proportionally scaled to fit 100% on a single A4 sheet with zero page cuts or sliced text.
          if (totalImgHeightPt <= pageHeightPt * 1.25) {
            const scaleFactor = Math.min(1, pageHeightPt / totalImgHeightPt);
            const fitWidth = pageWidthPt * scaleFactor;
            const fitHeight = totalImgHeightPt * scaleFactor;
            const offsetX = (pageWidthPt - fitWidth) / 2;

            if (isVintage) {
              doc.setFillColor(251, 249, 244);
              doc.rect(0, 0, pageWidthPt, pageHeightPt, 'F');
            } else if (isTractor) {
              doc.setFillColor(251, 251, 247);
              doc.rect(0, 0, pageWidthPt, pageHeightPt, 'F');
            }
            doc.addImage(canvas, 'PNG', offsetX, 0, fitWidth, fitHeight, undefined, 'FAST');
          } else {
            // Truly multi-page document (> 1.25x A4 height, e.g. 7+ items):
            // Perform DOM-aware clean page breaks between rows and blocks so no text line,
            // table row, totals module, or barcode is ever sliced in half.
            const domWidth = paperTarget.offsetWidth || 794;
            const domHeight = paperTarget.scrollHeight || paperTarget.offsetHeight || (canvas.height / 2);
            const ptPerPx = pageWidthPt / domWidth;

            // Page 1 has internal DOM top padding, leaves 24pt bottom margin
            const maxPage1HeightPt = pageHeightPt - 24;
            const maxPage1HeightPx = maxPage1HeightPt / ptPerPx;

            // Page 2+ needs 32pt top margin and 24pt bottom margin
            const pageTopPadPt = 32;
            const maxPageNHeightPt = pageHeightPt - pageTopPadPt - 24;
            const maxPageNHeightPx = maxPageNHeightPt / ptPerPx;

            const pageBreaks = computeCleanPageBreaks(paperTarget, domHeight, maxPage1HeightPx, maxPageNHeightPx);

            for (let i = 0; i < pageBreaks.length - 1; i++) {
              const startDomY = pageBreaks[i];
              const endDomY = pageBreaks[i + 1];
              const cStartY = Math.max(0, Math.floor(startDomY * (canvas.height / domHeight)));
              const cEndY = Math.min(canvas.height, Math.ceil(endDomY * (canvas.height / domHeight)));
              const cSliceHeight = cEndY - cStartY;

              if (cSliceHeight <= 0) continue;

              const sliceCanvas = document.createElement('canvas');
              sliceCanvas.width = canvas.width;
              sliceCanvas.height = cSliceHeight;
              const sCtx = sliceCanvas.getContext('2d');
              sCtx.fillStyle = docBg;
              sCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
              sCtx.drawImage(
                canvas,
                0, cStartY, canvas.width, cSliceHeight,
                0, 0, sliceCanvas.width, cSliceHeight
              );

              const sliceHeightPt = (cSliceHeight * pageWidthPt) / canvas.width;

              if (i === 0) {
                if (isVintage) {
                  doc.setFillColor(251, 249, 244);
                  doc.rect(0, 0, pageWidthPt, pageHeightPt, 'F');
                } else if (isTractor) {
                  doc.setFillColor(251, 251, 247);
                  doc.rect(0, 0, pageWidthPt, pageHeightPt, 'F');
                }
                doc.addImage(sliceCanvas, 'PNG', 0, 0, pageWidthPt, sliceHeightPt, undefined, 'FAST');
              } else {
                doc.addPage();
                if (isVintage) {
                  doc.setFillColor(251, 249, 244);
                  doc.rect(0, 0, pageWidthPt, pageHeightPt, 'F');
                  // Draw authentic continuous vermilion margin rules down through the top margin
                  doc.setDrawColor(210, 50, 40);
                  doc.setLineWidth(0.75);
                  doc.line(25.5, 0, 25.5, pageTopPadPt + 2);
                  doc.line(28.5, 0, 28.5, pageTopPadPt + 2);
                } else if (isTractor) {
                  doc.setFillColor(251, 251, 247);
                  doc.rect(0, 0, pageWidthPt, pageHeightPt, 'F');
                }
                doc.addImage(sliceCanvas, 'PNG', 0, pageTopPadPt, pageWidthPt, sliceHeightPt, undefined, 'FAST');
              }
            }
          }

          doc.save(fileName);
        }

        if (this.workbench && typeof this.workbench.setStatus === 'function') {
          this.workbench.setStatus(`PDF downloaded: ${fileName}`);
        }
      } catch (err) {
        console.error('PDF export error:', err);
        alert('error generating client-side PDF: ' + (err.message || err) + '. Falling back to browser print.');
        this.print();
      } finally {
        if (scaler) {
          scaler.style.transform = originalTransform;
        }
        paperTarget.classList.remove('inv-exporting-pdf');
        if (pdfBtn) {
          pdfBtn.disabled = false;
          pdfBtn.innerHTML = origBtnText || 'download PDF';
        }
      }
    },

    print() {
      const template = this.state.meta.template || 'stripe-modern';
      const isThermal = template === 'thermal-pos' || template === 'thermal-retail-mushak';
      const is58 = isThermal && this.state.meta.thermalWidth === '58mm';
      const totals = computeDocumentTotals(this.state);

      // Render fresh vector HTML
      let docContent = '';
      if (template === 'stripe-modern') docContent = this.generateStripeModernHtml(this.state, totals);
      else if (template === 'thermal-pos') docContent = this.generateThermalPosHtml(this.state, totals);
      else if (template === 'minimal-classic') docContent = this.generateMinimalClassicHtml(this.state, totals);
      else if (template === 'bn-vintage-ledger') docContent = this.generateBnVintageLedgerHtml(this.state, totals);
      else if (template === 'mid-century-tractor') docContent = this.generateMidCenturyTractorHtml(this.state, totals);
      else if (template === 'erp-classic-90s') docContent = this.generateErpClassic90sHtml(this.state, totals);
      else if (template === 'thermal-retail-mushak') docContent = this.generateThermalRetailMushakHtml(this.state, totals);

      // Extract Barcode SVG
      let barcodeSvg = '';
      if (this.state.meta.showBarcode !== false && window.TextEngine) {
        const text = (this.state.meta.barcodeValue && this.state.meta.barcodeValue.trim())
          || this.extractSettlementUrl()
          || (this.state.meta.docNumber || 'DOC-0001');

        if (this.state.meta.barcodeSymbology === 'QR') {
          barcodeSvg = window.TextEngine.generate2DCodeSvg(text, 'qr', { border: 1, darkColor: '#000000', lightColor: '#ffffff' });
        } else if (this.state.meta.barcodeSymbology === 'DATAMATRIX') {
          barcodeSvg = window.TextEngine.generate2DCodeSvg(text, 'datamatrix', { border: 1, darkColor: '#000000', lightColor: '#ffffff' });
        } else if (this.state.meta.barcodeSymbology === 'EAN13') {
          let num = text.replace(/\D/g, '');
          if (num.length < 12) num = (num + '202604062336').slice(0, 12);
          else num = num.slice(0, 12);
          barcodeSvg = window.TextEngine.generateBarcodeSvg(num, { format: 'EAN13', width: 1.4, height: 38, displayValue: true, margin: 4 });
        } else {
          barcodeSvg = window.TextEngine.generateBarcodeSvg(text, { format: 'CODE128', width: 1.4, height: 38, displayValue: true, margin: 4 });
        }

        if (this.state.meta.barcodeSymbology === 'QR' || this.state.meta.barcodeSymbology === 'DATAMATRIX') {
          barcodeSvg = barcodeSvg.replace(/<\?xml[\s\S]*?\?>/i, '').trim();
          if (!/<svg[^>]*\bwidth=/i.test(barcodeSvg)) {
            barcodeSvg = barcodeSvg.replace('<svg', '<svg width="76" height="76"');
          }
        }
      }

      // Replace barcode placeholder with SVG in print markup
      docContent = docContent.replace(
        '<div id="receipt-barcode-target" class="receipt-barcode-target"></div>',
        `<div id="receipt-barcode-target" class="receipt-barcode-target">${barcodeSvg}</div>`
      ).replace(
        '<div id="receipt-barcode-target" class="receipt-barcode-target thermal-barcode"></div>',
        `<div id="receipt-barcode-target" class="receipt-barcode-target thermal-barcode">${barcodeSvg}</div>`
      ).replace(
        '<div id="receipt-barcode-target" class="receipt-barcode-target mushak-barcode"></div>',
        `<div id="receipt-barcode-target" class="receipt-barcode-target mushak-barcode">${barcodeSvg}</div>`
      ).replace(
        '<div id="receipt-barcode-target" class="receipt-barcode-target vbn-barcode"></div>',
        `<div id="receipt-barcode-target" class="receipt-barcode-target vbn-barcode">${barcodeSvg}</div>`
      ).replace(
        '<div id="receipt-barcode-target" class="receipt-barcode-target tractor-barcode"></div>',
        `<div id="receipt-barcode-target" class="receipt-barcode-target tractor-barcode">${barcodeSvg}</div>`
      ).replace(
        '<div id="receipt-barcode-target" class="receipt-barcode-target erp-barcode"></div>',
        `<div id="receipt-barcode-target" class="receipt-barcode-target erp-barcode">${barcodeSvg}</div>`
      );

      // Create isolated printing iframe
      let iframe = document.getElementById('inv-print-iframe');
      if (iframe) iframe.parentNode.removeChild(iframe);

      iframe = document.createElement('iframe');
      iframe.id = 'inv-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      const origin = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');

      const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${escapeHTML(this.state.meta.docNumber)}</title>
          <base href="${origin}">
          <link rel="stylesheet" href="style.css">
          <style>
            @page {
              size: ${isThermal ? (is58 ? '58mm auto' : '80mm auto') : 'A4'};
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .inv-paper {
              box-shadow: none !important;
              margin: 0 auto !important;
              width: ${isThermal ? (is58 ? '58mm' : '80mm') : '794px'} !important;
              max-width: none !important;
              padding: ${isThermal ? (is58 ? '8px 6px !important' : '12px 10px !important') : (template === 'bn-vintage-ledger' ? '32px 36px 32px 56px !important' : (template === 'mid-century-tractor' ? '0 !important' : (template === 'erp-classic-90s' ? '34px 38px !important' : '48px !important')))};
            }
            .receipt-barcode-target svg {
              max-width: 100% !important;
              height: auto !important;
            }
          </style>
        </head>
        <body class="inv-print-body inv-tpl-${template} ${isThermal ? (is58 ? 'thermal-58mm' : 'thermal-80mm') : ''}">
          <div class="inv-paper inv-tpl-${template} ${is58 ? 'thermal-58mm' : ''}">
            ${docContent}
          </div>
        </body>
        </html>
      `;

      doc.open();
      doc.write(printHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          console.error('print execution failed', e);
        }
      }, 350);
    }
  };

  // Pre-seed templateStates and default active state on singleton
  InvoiceGenerator.templateStates = {};
  for (const key of Object.keys(SAMPLE_PRESETS)) {
    InvoiceGenerator.templateStates[key] = cloneObject(SAMPLE_PRESETS[key]);
  }
  InvoiceGenerator.state = InvoiceGenerator.templateStates['stripe-modern'];

  return InvoiceGenerator;
});
