(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TextEngine = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const sec = ["193", "225", "192", "224", "194", "226", "461", "462", "258", "259", "195", "227", "7842", "7843", "7840", "7841", "196", "228", "197", "229", "256", "257", "260", "261", "7844", "7845", "7846", "7847", "7850", "7851", "7848", "7849", "7852", "7853", "7854", "7855", "7856", "7857", "7860", "7861", "7858", "7859", "7862", "7863", "506", "507", "262", "263", "264", "265", "268", "269", "266", "267", "199", "231", "270", "271", "272", "273", "201", "233", "200", "232", "202", "234", "282", "283", "276", "277", "7868", "7869", "7866", "7867", "278", "279", "203", "235", "274", "275", "280", "281", "7870", "7871", "7872", "7873", "7876", "7877", "7874", "7875", "7864", "7865", "7878", "7879", "286", "287", "284", "285", "288", "289", "290", "291", "292", "293", "294", "295", "205", "237", "204", "236", "300", "301", "206", "238", "463", "464", "207", "239", "296", "297", "302", "303", "298", "299", "7880", "7881", "7882", "7883", "308", "309", "310", "311", "313", "314", "317", "318", "315", "316", "321", "322", "319", "320", "323", "324", "327", "328", "209", "241", "325", "326", "211", "243", "210", "242", "334", "335", "212", "244", "7888", "7889", "7890", "7891", "7894", "7895", "7892", "7893", "465", "466", "214", "246", "336", "337", "213", "245", "216", "248", "510", "511", "332", "333", "7886", "7887", "416", "417", "7898", "7899", "7900", "7901", "7904", "7905", "7902", "7903", "7906", "7907", "7884", "7885", "7896", "7897", "7764", "7765", "7766", "7767", "340", "341", "344", "345", "342", "343", "346", "347", "348", "349", "352", "353", "350", "351", "356", "357", "354", "355", "358", "359", "218", "250", "217", "249", "364", "365", "219", "251", "467", "468", "366", "367", "220", "252", "471", "472", "475", "476", "473", "474", "469", "470", "368", "369", "360", "361", "370", "371", "362", "363", "7910", "7911", "431", "432", "7912", "7913", "7914", "7915", "7918", "7919", "7916", "7917", "7920", "7921", "7908", "7909", "7810", "7811", "7808", "7809", "372", "373", "7812", "7813", "221", "253", "7922", "7923", "374", "375", "376", "255", "7928", "7929", "7926", "7927", "7924", "7925", "377", "378", "381", "382", "379", "380", "208"];
  const rep = ["A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "A", "a", "C", "c", "C", "c", "C", "c", "C", "c", "C", "c", "D", "d", "D", "d", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "E", "e", "G", "g", "G", "g", "G", "g", "G", "g", "H", "h", "H", "h", "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "I", "i", "J", "j", "K", "k", "L", "l", "L", "l", "L", "l", "L", "l", "L", "l", "N", "n", "N", "n", "N", "n", "N", "n", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "O", "o", "P", "p", "P", "p", "R", "r", "R", "r", "R", "r", "S", "s", "S", "s", "S", "s", "S", "s", "T", "t", "T", "t", "T", "t", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "U", "u", "W", "w", "W", "w", "W", "w", "W", "w", "Y", "y", "Y", "y", "Y", "y", "Y", "y", "Y", "y", "Y", "y", "Y", "y", "Z", "z", "Z", "z", "Z", "z", "D"];
  const wordlist = "aaron;abandon;abide;abilities;ability;able;abnormal;aboard;about;above;absence;absent;absolute;absolutely;absorb;abstract;abundant;academic;academy;accelerate;accept;acceptable;acceptance;accepted;access;accesses;accident;accompanied;accompany;accomplish;accord;accordance;according;accordingly;account;accumulate;accuracy;accurate;accurately;accuse;accused;accustom;achieve;achievement;acid;acknowledge;acknowledged;acquire;acquired;acres;across;act;acted;acting;action;actions;activate;active;actively;activities;activity;actor;actors;actress;actual;actually;adam;adams;adapt;add;adding;addition;additional;address;adequate;adhere;adjacent;adjective;adjust;adjusted;administer;administration;administrative;administrator;admire;admission;admit;admitted;admitting;adolescent;adopt;adopted;adoption;adult;adults;advance;advanced;advancement;advantage;adventure;adverse;advertise;advertisement;advertisers;advertising;advice;advise;advised;advisory;advocate;aesthetic;affair;affairs;affect;affecting;affiliate;affluence;afford;afraid;africa;african;after;afternoon;again;against;age;agencies;agency;agenda;agent;aggregate;aggression;agitate;ago;agree;agreed;agreement;agricultural;agriculture;ah;ahead;aid;aim;aimed;ain;air;airplane;airplanes;airport;alan;alarm;alarming;alaska;albert;alcohol;ale;alert;alexander;alice;alienation;alight;align;alignment;alike;alive;all;allege;alliance;allied;allies;allocate;allotment;allow;allowance;allowances;allowed;allowing;allows;allude;ally;almost;alone;along;aloud;alphabet;already;also;altered;alternative;although;altogether;always;am;amanda;amateur;amaze;amazing;amber;ambiguity;ambiguous;ambition;ambitious;amendment;america;american;americans;amid;among;amongst;amorphous;amount;amounts;amuse;amusement;amy;an;analogy;analyse;analysis;analytical;analyze;ancient;and;andrea;andrew;angela;angeles;angle;angles;angry;angular;animal;animals;animated;ankle;ann;anna;anniversary;announce;announced;announcement;annoy;annoyance;annual;annul;anomaly;anonymous;another;answer;answered;answers;ant;anthony;anti;anticipate;anticipated;anticipation;ants;anxiety;anxious;any;anybody;anyhow;anymore;anyone;anyplace;anything;anytime;anyways;anywhere;apart;apartment;apologise;apologize;apology;apparatus;apparent;apparently;appeal;appealing;appeals;appear;appearance;appearances;appeared;appears;append;appendix;applaud;applause;apple;apples;application;applied;apply;applying;appoint;appointment;appraise;appreciate;appreciation;approach;approached;appropriate;approval;approve;approximate;approximately;april;arbitrary;arbitrate;arbitration;arch;architect;are;area;areas;aren;arent;argentina;argue;arguing;argument;arise;aristocrat;arithmetic;arive;arizona;arkansas;arm;arms;army;around;arouse;arrange;arranged;arrangement;arrest;arrested;arrival;arrive;arrived;arrow;arrows;art;arthur;article;articles;artificial;artist;artistic;artists;as;ascent;ascertain;ascribe;ashamed;ashley;asia;aside;ask;asked;asking;asleep;aspect;aspects;aspiration;ass;assemble;assembled;assembly;assent;assertive;assess;assessment;assessors;assign;assigned;assignment;assignments;assimilate;assist;assistance;assistant;associate;associated;association;associations;assume;assumed;assumption;assumptions;assure;assured;astonish;astronomy;at;ate;atlantic;atmosphere;atom;atomic;atoms;attach;attached;attack;attain;attempt;attempted;attempting;attempts;attend;attention;attentive;attitude;attorney;attract;attraction;attractive;attribute;attributes;audible;audience;audio;audited;august;aunt;austin;australia;authentic;author;authorities;authority;authorize;authorized;authors;auto;automatic;automatically;automobile;automobiles;autumn;avail;availability;avenue;average;averse;avoid;avoidance;avoided;awake;award;awards;aware;awareness;away;awe;awfully;awkward;awkwardly;awoke;awoken;axe;axis;babies;baby;back;background;backup;backward;backwards;bad;badly;bag;baggage;bags;bake;bakers;balance;balanced;ball;ballet;balloon;balls;ban;band;bang;bank;bankrupt;banks;bar;barbara;barber;bare;barely;bargain;bargains;bark;barn;barrel;barrier;bars;base;baseball;based;basement;bases;basic;basically;basin;basis;basket;bat;bath;bathe;bathroom;batteries;battery;battle;battled;bay;be;beach;bead;beam;bean;beans;bear;bearing;bears;beast;beasts;beat;beaten;beautiful;beauty;became;because;become;becomes;becoming;bed;bedroom;bedtime;bee;beef;been;beer;bees;before;beg;began;begin;beginning;begins;begun;behalf;behave;behavior;behaviour;behind;behold;being;belief;believe;believed;believes;bell;bells;belly;belong;belonged;belongs;below;belt;bench;bend;beneath;benefit;benefits;benjamin;bent;berry;beset;beside;besides;best;bet;better;betty;between;beverly;beyond;bible;bicycle;bid;big;bigger;biggest;bill;billion;bills;billy;bind;binding;biological;biology;bird;birds;birth;birthday;bit;bite;bits;bitten;bitter;black;blade;blame;blank;blanket;bleach;bleed;blemish;blend;bless;blew;blind;blink;block;blockage;blocks;blog;blond;blonde;blood;blot;blow;blowing;blown;blue;blunt;blush;board;boards;boardwalk;boast;boat;boating;bob;bobby;bodies;body;boil;bold;boldly;bolt;bomb;bombs;bond;bonds;bone;bones;book;books;boot;boots;border;bore;boring;born;borrow;borrowed;boss;boston;both;bother;bottle;bottom;bought;bounce;bound;boundary;bounds;bow;bowl;box;boxes;boy;boyfriend;boys;brain;brainstorm;brake;brakes;branch;branches;brand;brandon;brass;brave;bravery;brazil;breach;bread;breadth;break;breakfast;breaking;breaks;breakup;breath;breathe;breathing;breed;breeds;breeze;brenda;brian;bribe;bribery;brick;bride;bridge;bridges;brief;briefly;bright;brighten;brilliant;bring;bringing;brings;britain;british;brittany;broad;broadcast;broadway;broke;broken;broker;brother;brothers;brought;brown;browser;bruce;bruise;brush;brushed;bryan;bubble;bucket;budget;buffalo;buffer;bug;bugs;build;builder;builders;building;buildings;builds;built;bulk;bullet;bulletin;bullets;bump;bunch;bundle;bureau;bureaucracy;buried;burn;burned;burning;burns;burnt;burst;bury;bus;bush;business;businesses;businesslike;businessman;bust;busy;but;butter;button;buy;buying;buzz;by;bygone;bypass;cabin;cady;cage;cake;calculate;calculated;calculation;calculator;calendar;california;call;called;calling;calls;calm;came;camera;camp;campaign;campus;can;canal;cancel;cancer;candidate;candy;cannot;cant;cap;capabilities;capable;cape;capital;capitol;captain;caption;capture;captured;car;carbon;card;cards;care;career;careers;careful;carefully;careless;carelessly;carl;carleton;carol;carolina;carolyn;carriage;carried;carries;carry;carrying;cars;cart;carve;case;cases;casey;cash;cast;castle;casual;cat;catalog;catalogue;catastrophic;catch;categories;category;catherine;catholic;cattle;caught;cause;caused;causes;caution;cautious;cavalry;cave;cease;ceiling;celebrate;celebrities;cell;cellphone;cells;cement;cent;center;centers;central;cents;centuries;century;ceremony;certain;certainly;certainty;chain;chair;chairman;chairs;chalk;challenge;challenged;challenges;chamber;champion;champions;championship;championships;chance;chances;change;changed;changes;changing;channel;channels;chapel;chapter;character;characteristic;characteristics;characterized;characters;charge;charged;charges;charles;charlie;charming;chart;charter;chase;cheap;cheat;check;checked;cheek;cheer;cheese;chemical;cheryl;chest;chew;chicago;chicken;chickens;chief;chiefly;child;childhood;children;chile;chimney;china;chinese;choice;choke;cholesterol;choose;choosing;chop;chose;chosen;christian;christina;christine;christmas;christopher;church;churches;cigarette;circle;circles;circuit;circular;circulate;circumstance;circumstances;circus;cited;cities;citizen;citizens;city;civic;civil;civilian;civilization;civilize;claim;claims;clap;clarify;clarity;class;classes;classic;classical;classification;classify;classroom;claws;clay;clean;cleaning;clear;cleared;clearer;clearing;clearly;clerk;clever;click;clicking;client;cliff;climate;climb;climbed;climbing;cling;clinic;clinical;clip;clock;close;closed;closely;closer;closing;cloth;clothe;clothes;clothing;cloud;clouds;cloudy;club;clubs;clues;co;coach;coal;coarse;coarses;coast;coat;cocktail;code;coded;codes;coefficient;coffee;cogent;coil;coin;coincide;coins;cold;collapse;collapsed;collar;colleague;colleagues;collect;collected;collection;collections;collective;collector;collectors;college;colleges;collide;collison;colombia;colonel;colonial;colonies;colony;color;colorado;colored;colorful;colors;colour;column;columns;comb;combat;combination;combine;combined;combustion;come;comedy;comes;comfort;comfortable;coming;command;commander;commands;comment;comments;commerce;commercial;commission;commissioner;commit;committed;committee;commodities;commodity;common;commonly;commons;commune;communicate;communication;communications;communist;communities;community;companies;companion;companionship;company;comparable;compare;compared;comparison;compass;compatible;compel;compensate;compete;competence;competent;competition;competitive;competitor;competitors;compile;complain;complained;complaining;complaint;complaints;complement;complete;completed;completely;completion;complex;complicate;complicated;complication;comply;component;components;compose;composed;composition;compound;compounds;comprehend;comprise;compromise;compulsion;compulsory;compute;computed;computer;computers;computing;conceal;concede;conceive;conceived;concentrate;concentration;concentric;concept;conception;concepts;concern;concerned;concerning;concerns;concert;concerts;conclude;concluded;conclusion;conclusions;concrete;condemned;condense;condition;conditioned;conditions;conduct;conducted;conducting;conductor;confer;conference;conferences;confess;confession;confidence;confident;confidential;configuration;confine;confirmation;confirmed;conflict;conform;confront;confronted;confuse;confusion;congratulate;congratulation;congregation;congress;congressman;connect;connected;connecticut;connection;conquer;conqueror;conquest;conscience;conscious;consciousness;consent;consequence;consequences;consequent;consequently;conservative;conserve;consider;considerable;considerably;consideration;considerations;considered;considering;consist;consisted;consistent;consistently;consisting;consists;console;consolidate;consonant;conspicuous;conspiracy;constant;constantly;constitute;constitution;constitutional;construct;constructed;construction;consult;consume;consumer;consumers;contact;contacts;contain;contained;containing;contains;contaminate;contemporary;contend;content;contents;contest;context;continent;continental;contingent;continually;continue;continued;continues;continuing;continuity;continuous;continuously;contract;contracted;contracts;contradict;contrary;contrast;contribute;contributed;contribution;contributions;control;controlled;controlling;controls;controversial;controversy;convene;convenience;convenient;conveniently;convention;conventional;converge;conversation;conversion;convert;converted;conviction;convictions;convince;convinced;convincing;cook;cookies;cooking;cool;cooling;cooperate;cooperation;cooperative;coordinate;cope;copied;copier;copies;copper;copy;copying;cord;core;corn;corner;corners;corporate;corporation;corporations;corps;correct;correction;correctly;correlate;correspond;correspondence;corresponding;corridor;corrode;cost;costs;cottage;cotton;couch;cough;could;couldn;couldnt;council;counsel;count;counted;counter;counties;counting;countries;country;county;couple;courage;course;court;courts;cousin;cover;coverage;covered;covering;covers;cow;coward;cowardly;cowboy;cowboys;cows;crack;craft;craig;crash;crashed;crawl;crawled;crazed;cream;create;created;creates;creating;creative;creature;creatures;credible;creek;creep;crew;cried;crime;criminal;criminals;crises;crisis;criterion;critic;critical;critically;criticism;critics;critique;crop;cross;crossed;crossing;crossword;crowd;crowded;crown;crucial;cruel;crush;cry;crying;crystal;cuba;cube;cultivate;cultivation;cultivator;cultural;culture;cultured;cultures;cumbersome;cup;cupcake;cure;curiosity;curious;curl;currency;current;currently;currents;curse;cursed;curtain;curve;curved;cushion;custom;customary;customer;customers;customize;customs;cut;cuts;cutting;cycle;cylinder;cynthia;dad;daily;dakota;dam;damage;damn;damp;dance;dancer;dancers;dances;dancing;danger;dangerous;daniel;danielle;dare;daredevil;dark;darken;darkness;dart;dash;data;date;dates;daughter;david;dawn;day;daydream;daylight;days;de;dead;deafen;deal;deals;dealt;dean;dear;death;debate;deborah;debra;debt;decades;decay;deceit;deceive;december;decent;decide;decided;decidedly;decision;decisions;decisive;deck;declaration;declare;declared;decline;decorate;decrease;decreasing;dedicate;dedicated;dedication;deduct;deem;deep;deepen;deeper;deeply;deer;default;defeat;defeats;defect;defence;defend;defendant;defense;defer;deficient;define;defined;definite;definitely;definition;definitions;defintion;deflect;degenerate;degrade;degree;degrees;delaware;delay;delegate;delete;deliberate;deliberately;delicate;delight;delighted;delightful;deliver;delivery;demand;demanded;democracy;democratic;democrats;demonstrate;demonstrated;demonstration;denise;denmark;dennis;denote;density;deny;department;departments;depend;dependence;dependent;depending;depends;depress;depressed;depression;deprive;depth;derive;derived;descend;descendant;descent;describe;described;describes;description;desegregation;desert;deserve;design;designed;designs;desirable;desire;desired;desires;desk;desks;desperate;desperately;despite;destiny;destroy;destroyed;destruction;destructive;detail;detailed;details;detained;detect;detective;detergent;determination;determine;determined;determines;determining;detriment;develop;developed;developers;developing;development;developments;deviate;device;devices;devise;devote;devoted;diagnose;diagram;diameter;diamond;diana;diane;dictate;dictionary;did;didn;didnt;die;died;diet;differ;difference;differences;different;difficult;difficulties;difficulty;diffuse;diffusion;dig;digest;digestion;digit;digital;dignity;dilemma;dilute;dimension;dimensions;dine;diner;diners;dining;dinner;dip;diplomatic;direct;directed;direction;directions;directly;director;directors;directory;dirt;dirty;disadvantage;disagree;disappear;disappearance;disappeared;disappoint;disappointed;disappointment;disapprove;disarm;disaster;discern;discharge;discipline;disciplines;discomfort;discontent;discount;discourse;discover;discovered;discovery;discrete;discrimination;discuss;discussed;discusses;discussion;discussions;disease;disemvowel;disgust;dish;dishes;dislike;dismember;dismiss;disorganized;dispense;disperse;displace;displacement;display;displayed;displays;disposal;dispose;disprove;dispute;disregard;disrespect;dissatisfaction;dissatisfy;dissect;dissipate;dissolve;distance;distances;distant;distinct;distinction;distinctive;distinguish;distinguished;distort;distribute;distributed;distribution;district;districts;disturb;disturbed;disturbing;ditch;dive;diverge;diverse;divert;divide;divided;dividend;divine;division;divorce;do;doc;doctor;doctors;doctrine;document;documents;does;doesn;doesnt;dog;doghouse;dogs;doing;doll;dollar;dollars;domain;domestic;dominant;dominate;dominated;donald;done;donkey;donna;dont;door;doors;doris;dorothy;dot;dots;double;doubt;doubtful;douglas;down;downhill;download;downtown;dozen;dr;draft;drag;drain;drama;dramatic;dramatically;dramatize;drank;drastic;draw;drawer;drawing;drawings;drawn;dream;dreamed;dreams;dreamt;dress;dressed;dressing;drew;dried;drill;drink;drinking;drinks;drip;drive;driven;driver;drivers;driveway;driving;drop;dropped;drops;drove;drown;drug;drugs;drum;drunk;dry;drying;duck;ducks;due;dug;dull;durable;duration;during;dust;dutch;duties;duty;dvd;dwell;dying;dylan;dynamic;dysfunctional;each;eager;ear;earlier;earliest;early;earn;earnings;ears;earth;ease;easier;easily;east;easy;eat;eaten;eating;ebay;economic;economical;economy;edges;edible;edit;edited;edition;editor;editorial;editors;educate;educated;educates;education;educational;educator;edward;effect;effective;effectively;effectiveness;effects;efficiency;efficient;effort;efforts;egg;eggs;egypt;eight;eighteen;eighteenth;eighty;either;elaborate;elastic;elder;elderly;elect;elected;electing;election;electric;electrical;electrician;electricity;electronic;electronics;element;elementary;elements;elephant;elephants;elevate;eleven;elicit;eliminate;eliminated;elizabeth;ellen;else;elsewhere;emancipate;embarrass;embody;embrace;emerge;emerged;emergency;emily;emma;emotion;emotional;emotions;emphasis;emphasize;emphatic;empire;empirical;employ;employed;employee;employees;employment;empty;enable;enacted;enclose;enclosed;enclosure;encounter;encountered;encounters;encourage;encouraged;encouraging;end;ended;ending;endless;endure;endured;enemies;enemy;energy;enforce;enforced;enforcement;engaged;engagement;engine;engineer;engineering;engineers;engines;england;english;enhance;enjoy;enjoyed;enjoyment;enlarged;enlighten;enlist;enormous;enormously;enough;enrich;ensure;enter;entered;entering;enterprise;entertain;entertainment;enthusiasm;enthusiastic;entire;entirely;entitled;entity;entrance;entries;entry;enumerate;envious;environment;environmental;envy;episode;episodes;equal;equality;equally;equate;equation;equator;equilibrium;equip;equipment;equipped;equitable;equity;equivalent;eric;error;errors;escape;especially;essay;essence;essential;essentially;establish;established;establishing;establishment;estate;estimate;estimated;estimates;etc;eternal;ethan;ethical;ethics;eugene;euro;europe;european;evacuated;evaluate;evaluation;evaporate;eve;evelyn;even;evening;event;events;eventual;eventually;ever;everlasting;evermore;every;everybody;everyday;everyone;everything;everywhere;evidence;evident;evidently;evoke;evolve;exact;exactly;examination;examine;examined;examines;example;examples;exceed;excellence;excellent;except;excepting;exception;exceptions;excess;excessive;exchange;excite;excited;excitement;exciting;exclaimed;exclude;excluding;exclusive;exclusively;excuse;execute;executive;exempt;exercise;exercises;exert;exhaust;exhibit;exhibition;exile;exist;existed;existence;existing;exists;expand;expanded;expanding;expanse;expansion;expect;expectations;expected;expects;expedite;expel;expenditures;expense;expensive;experience;experienced;experiences;experiment;experimental;experiments;expert;experts;explain;explained;explains;explanation;explicit;explode;exploit;exploration;explore;explosion;explosive;exponent;export;exporting;expose;exposed;exposure;express;expressed;expressing;expression;extant;extend;extended;extending;extension;extensive;extensively;extent;external;extinguish;extra;extract;extraordinary;extreme;extremely;eye;eyebrow;eyes;fabric;fabrics;face;facebook;faced;faces;facilitate;facilities;facing;fact;faction;factor;factories;factors;factory;facts;factual;faculty;fade;fail;failed;fails;failure;failures;faint;fair;fairly;faith;faithful;fall;fallacy;fallen;falling;fallout;falls;false;fame;familiar;families;family;famous;fan;fancy;fans;fantastic;far;fares;farm;farmer;farmers;farming;farms;farsighted;farther;fascinating;fascination;fashion;fast;fasten;fastened;faster;fastest;fat;fatal;fate;father;fathers;fatigue;fatten;fault;faulty;favor;favorable;favorite;favors;favour;fax;fear;fears;feasible;feast;feather;feathers;feature;featured;features;february;fed;federal;federation;feeble;feedback;feeding;feel;feeling;feelings;feels;fees;feet;felix;fell;fellow;fellowship;felt;female;females;fertile;festival;fetch;fever;few;fewer;fibers;fiction;field;fields;fierce;fifteen;fifth;fifty;fig;fight;fighting;fights;figure;figured;figures;filament;file;filing;fill;filled;filling;film;films;filter;final;finalize;finally;finance;financed;financial;financing;find;finding;findings;finds;fine;finest;finger;fingers;finish;finished;finite;finland;fire;fired;fireplace;fires;firing;firm;firmly;firms;first;fiscal;fish;fishing;fit;fits;fitted;five;fix;fixed;flag;flame;flap;flare;flash;flat;flatten;flavor;flavors;flavour;fled;flee;flew;flexible;flies;flight;fling;float;floating;flood;floor;florida;flour;flow;flower;flowers;flown;flows;fluctuate;fluent;fluid;flux;fly;flying;foam;foams;focus;fog;foil;fold;folk;folklore;folks;follow;followed;following;follows;fond;food;foods;fool;foolish;foot;football;footprint;for;forbid;force;forced;forces;forecast;forego;foreign;foresee;forest;forests;foretell;forever;forgave;forget;forgive;forgiven;forgo;forgot;forgotten;fork;form;formal;format;formation;formatting;formed;former;formerly;forming;forms;formula;formulas;formulate;forsake;fort;forth;fortunate;fortunately;fortune;forty;forum;forward;fossil;fought;found;foundation;founded;four;fourteen;fourth;fourty;fox;fraction;fractions;fragment;frame;frames;framework;france;frances;frank;fraternal;fraud;free;freedom;freely;freeze;freight;french;frenchfries;frequencies;frequency;frequent;frequently;fresh;friction;friday;friend;friendliness;friendly;friends;friendship;fright;frighten;frightened;frightening;frog;from;front;frontal;frontier;froze;frozen;fruit;fruits;frustrate;fry;fuel;fulfil;fulfill;full;fully;fun;function;functional;functions;fund;fundamental;funded;funding;funds;funeral;funny;fur;furnish;furnished;furnishing;furniture;further;furthermore;fuse;future;futures;gaiety;gain;gained;gains;galaxy;gallery;gallon;gallons;game;games;gang;gap;garage;garbage;garden;gardens;gary;gas;gasoline;gate;gather;gathered;gathering;gave;gaze;gear;geek;geeks;general;generally;generate;generation;generations;generous;genius;genres;gentle;gentleman;gentlemen;gently;genuine;geography;geometry;george;georgia;gerald;germ;german;germans;germany;gesture;get;gets;getting;giant;giants;gift;gigantic;gin;girl;girlfriend;girls;give;given;gives;giving;glad;glance;glanced;glass;glasses;glee;glide;global;globe;gloria;glory;glossary;glove;glow;glue;go;goal;goals;goat;god;gods;goes;going;gold;golden;golf;gone;good;goodbye;goodness;goods;google;goose;got;gotten;govern;governing;government;governmental;governments;governor;grab;grabbed;grace;grade;grades;grading;gradual;gradually;graduate;graduating;grain;grains;grammar;grand;grandfather;grandmother;grant;granted;grants;grapevine;graph;grasp;grass;grate;grateful;grave;gravity;gray;grayer;grease;great;greater;greatest;greatly;greece;greed;greek;greeks;green;greet;greeted;greetings;gregory;grew;grey;grin;grind;grinned;grip;groan;groove;ground;grounds;group;grouped;groups;grow;growing;grown;grows;growth;guarantee;guard;guards;guess;guest;guests;guidance;guide;guided;guilt;guilty;gulf;gun;gyro;habit;habitat;habits;had;hadnt;hair;haircut;half;halfway;hall;hallway;halt;ham;hamburger;hammer;hampshire;hand;handed;handful;handle;handled;handling;hands;handshake;handsome;handwrite;handwriting;hang;hanging;hannah;happen;happened;happening;happens;happily;happiness;happy;harass;harbor;harbors;harbour;hard;harden;harder;hardly;hardy;harm;harmful;harmless;harmony;harold;harry;harsh;harvest;has;haste;hasten;hat;hate;hats;haunt;have;haven;havent;having;hawaii;hay;he;head;headache;headed;heading;headquarters;heal;health;healthy;heap;hear;heard;hearing;heart;hearts;heat;heated;heather;heating;heaven;heavenly;heavier;heavily;heavy;hed;heel;heels;height;heighten;held;helen;hell;hello;help;helped;helpful;helping;helpless;helps;hemisphere;hen;hence;henry;her;herd;here;hereafter;hereby;hereditary;heredity;herein;heritage;hero;heroic;hers;herself;hes;hesitate;hesitated;hesitation;hi;hid;hidden;hide;hierarchy;high;higher;highest;highly;highway;hill;hills;him;himself;hinder;hindrance;hindsight;hinge;hire;hired;hiring;his;historic;historical;history;hit;hoard;hold;holder;holding;holds;hole;holes;holiday;hollow;hollywood;holy;home;homecoming;homemade;homes;hometown;homework;homogeneous;honest;honesty;honey;honor;honored;honorific;hook;hop;hope;hoped;hopeful;hopefully;hopes;hoping;horizon;horizontal;horn;horns;horror;horse;horses;hospital;hospitals;hostile;hot;hotel;hotels;hour;hours;house;household;houses;housewife;hover;how;howard;however;hug;huge;hum;human;humane;humanity;humans;humble;humor;humorous;humour;hundred;hundreds;hung;hungary;hunger;hungry;hunt;hunter;hunters;hunting;hurrah;hurried;hurry;hurt;husband;hut;hypothesis;hypothesize;ice;iceland;id;idaho;ideal;ideally;ideas;identical;identification;identified;identify;identity;ideological;idle;if;ignorant;ignore;ignored;ill;illegal;illinois;illness;illuminate;illusion;illustrate;illustrated;illustration;im;image;images;imaginary;imagination;imaginative;imagine;imagined;imitate;imitation;immediate;immediately;immense;impact;impacted;imperial;implement;implications;implicit;imply;implying;import;importance;important;importantly;impose;imposed;impossible;impress;impressed;impressions;impressive;improve;improved;improvement;improvements;improving;improvise;impulse;in;inadequate;inbox;inc;incentive;incessant;inch;inches;incident;incidents;incline;inclined;include;included;includes;including;inclusive;income;incompatible;inconsistent;incorporate;increase;increased;increases;increasing;increasingly;incredible;incredibly;indeed;independence;independent;index;indexed;indexing;india;indian;indiana;indians;indicate;indicated;indicates;indication;indigenous;indirect;individual;individuals;indonesia;indoor;induce;industrial;industries;industry;ineffective;inevitable;inevitably;infer;inference;inferior;inflation;influence;influenced;influential;inform;information;informed;ingenious;inherent;inherited;inhibit;initial;initiate;initiative;inject;injure;injured;injuries;injury;ink;inlay;inn;innate;inner;innocence;innocent;innovate;innovation;input;inquire;inquiry;insect;insects;insert;inserting;inside;insight;insist;insisted;inspect;inspection;inspire;inspired;instability;install;installed;instance;instances;instant;instead;instinct;institute;institution;institutions;instruct;instruction;instructions;instructor;instrument;instruments;insufficiently;insult;insulted;insulting;insurance;insure;insured;integer;integrate;integration;intellect;intellectual;intelligence;intelligent;intend;intended;intense;intensely;intensify;intensity;intensive;intention;intentional;intentions;interact;interactions;interest;interested;interesting;interests;interface;interfere;interference;interior;interlay;interlock;interlude;intermediate;intermittent;internal;international;internet;interpret;interpretation;interpreted;interrupt;interruption;intersect;interval;intervals;intervene;intervention;interview;interviews;intimacy;intimate;into;intoxicate;intriguing;intrinsic;introduce;introduced;introduction;intuitive;invade;invariably;invent;invented;invention;inventor;inventors;inventory;inverse;invest;investigate;investigated;investigating;investigation;investigations;investment;investor;investors;invisible;invitation;invite;invited;invoke;involve;involved;involves;involving;inward;iowa;iraq;ireland;irish;iron;ironic;irregularities;irrigate;irritate;is;island;islands;isnt;isolate;isolated;israel;issue;issued;issues;it;italian;italy;itch;item;its;itself;ive;jack;jacket;jacob;jacqueline;jail;jam;jamaica;james;jane;janet;janice;january;japan;japanese;jar;jason;jaw;jazz;jealous;jealousy;jean;jeffrey;jelly;jennifer;jeremy;jerk;jerry;jersey;jesse;jessica;jet;jewel;jimmy;joan;job;jobs;joe;jog;john;johnny;join;joined;joining;joint;joke;jonathan;jones;jordan;jose;joseph;joshua;journal;journey;joy;joyce;juan;judge;judges;judgment;judicial;judith;judy;juggle;julia;julie;july;jump;jumped;jumping;june;jungle;junior;juniors;jurisdiction;jury;just;justice;justified;justify;justin;kansas;karen;katherine;kathleen;kathryn;kathy;kayla;keep;keeping;keeps;keith;kelly;kenneth;kentucky;kept;kettle;kevin;key;keys;kid;kids;kill;killed;killer;killing;kimberly;kind;kindly;kindness;kindred;kinds;king;kingdom;kiss;kitchen;knee;kneel;knees;knew;knife;knit;knock;knocked;knockout;knot;know;knowing;knowledge;known;knows;kyle;label;labels;labor;laboratory;lack;lacked;lacking;ladder;lady;laid;lain;lake;lakes;lamp;land;landed;landing;landlord;lands;landscape;language;languages;laptop;large;largely;larger;largest;larry;last;lasted;late;lately;later;latest;latin;latter;laugh;laughed;laughing;laughter;launch;launched;laura;lauren;law;lawrence;laws;lawyer;lawyers;lay;layers;lazy;lead;leader;leaders;leadership;leading;leaf;league;lean;leaned;leap;leaped;learn;learned;learning;learnt;least;leather;leave;leaves;leaving;lecture;led;lee;left;leg;legacy;legal;legend;legible;legislate;legislation;legislative;legislators;legislature;legitimate;legs;leisure;lend;length;lengthen;lengths;lens;lent;less;lessen;lesser;lesson;lessons;let;lets;letter;letters;letting;level;levels;lever;leverage;lewd;liable;liberals;liberate;liberty;librarian;libraries;library;licence;license;licensed;lick;lid;lie;lies;life;lifeguard;lifetime;lift;lifted;light;lighten;lighting;lightly;lightning;liked;likelihood;likely;likeness;likes;lillian;limb;limit;limitations;limited;limits;lincoln;linda;line;linear;lines;linguistic;link;linked;lion;lip;lips;lipstick;liquid;liquidation;liquor;lisa;list;listed;listen;listened;listeners;listening;listings;lists;literally;literary;literature;litigate;little;live;lived;lively;lives;living;load;loaded;loads;loaf;loan;loans;lobby;local;locally;locate;located;location;locations;lock;locked;locking;locomotion;lodge;log;logic;logical;logs;london;lonely;long;longer;look;looked;looking;lookout;looks;loose;loosen;lord;lori;lose;losing;loss;losses;lost;lot;lots;loud;louis;louisiana;love;loved;lovely;lover;low;lower;lowered;lowest;loyal;loyalty;luck;lucky;lumber;lump;lunch;lung;lungs;luxury;lying;machine;machinery;machines;mad;made;magazine;magazines;magic;magnet;magnetic;magnificent;magnify;magnitude;mail;mailbox;mailing;main;maine;mainland;mainly;maintain;maintained;maintaining;maintains;maintenance;maize;major;majority;make;makers;makes;making;males;mall;mama;man;manage;managed;management;manager;managers;managing;manifest;manipulate;mankind;manner;mans;manual;manufacture;manufactured;manufacturer;manufacturers;manufacturing;many;map;marble;march;margaret;margin;maria;marie;marilyn;mark;marked;market;marketing;markets;marks;marriage;marriages;married;marry;mars;marshal;mart;martha;mary;maryland;mason;mass;massachusetts;massage;masses;massive;master;masterpiece;mat;match;matchbook;matched;matching;mate;material;materials;maternal;math;mathematical;mathematics;matrix;matter;matters;matthew;mature;maturity;maximum;may;maybe;mayor;me;meal;meals;mean;meaning;meaningful;meanings;means;meant;meantime;meanwhile;measure;measured;measurement;measurements;measures;measuring;meat;mechanic;mechanical;mechanism;meddle;mediate;medical;medicine;medium;meet;meeting;meetings;meets;megan;melissa;melody;melt;melted;melting;member;members;membership;memorial;memorise;memorize;memory;men;mend;mental;mention;mentioned;mentor;merchandise;merchant;merchants;mercy;mere;merely;merge;merged;merger;merging;merit;merry;mess;message;messages;messenger;met;metabolism;metal;metals;metaphor;method;methods;metropolitan;mexican;mexico;mice;michael;michelle;michigan;microscope;middle;midnight;might;mighty;migrate;mike;mild;mildred;mile;miles;military;milk;million;millions;mills;mind;minds;mine;mineral;minerals;mines;mini;minimal;minimum;minister;minnesota;minor;minority;minus;minute;minutes;miracle;mirror;misconceive;miserable;misery;mishap;mislead;miss;missed;missile;missiles;missing;mission;missionary;mississippi;missive;missouri;misspell;mist;mistake;misunderstand;mix;mixed;mixture;mixup;moan;mobile;mode;model;moderate;moderation;modern;modest;modestly;modesty;modify;moist;moisture;mold;molecular;molecules;moment;momentary;moments;momentum;monday;money;monitor;monitoring;monkey;monopoly;montana;month;monthly;months;monument;mood;moon;moonlight;moor;moral;morality;more;moreover;morning;morocco;mortgage;most;mostly;motel;mother;motherhood;motherly;mothers;motion;motivate;motivation;motive;motives;motor;motorcycle;mount;mountain;mountains;mountaintop;mounted;mourn;mouse;mouth;move;moved;movement;movements;movers;moves;movie;movies;moving;mow;mr;mrs;much;mud;muddle;mug;multiple;multiplication;multiplied;multiply;municipal;murder;muscle;muscles;museum;music;musical;musician;musicians;must;mutual;my;myself;mysteries;mysterious;mystery;myth;nail;nails;naked;name;named;namely;nancy;narrate;narrative;narrow;nathan;nation;national;nations;native;natural;naturally;nature;naval;navigate;navy;near;nearby;nearer;nearest;nearly;neat;neatly;nebraska;necessarily;necessary;necessity;neck;need;needed;needing;needle;needs;negative;neglect;neglectful;negotiate;negotiations;neighbor;neighborhood;neighboring;neighbors;neither;nephew;nerd;nerds;nerves;nervous;nest;netherlands;network;networking;networks;neutral;nevada;never;nevertheless;new;newer;newest;newly;news;newspaper;newspapers;next;nice;niche;nicholas;nicole;niece;night;nightmare;nighttime;nineteen;ninety;ninth;no;noble;nobody;nod;nodded;noise;nominate;non;none;nonsense;noon;nor;norm;normal;normalize;normally;norms;north;northern;northwest;norway;nose;not;notable;notably;notate;note;notebook;noted;nothing;notice;noticed;notified;notion;noun;nouns;novel;novels;november;now;nowadays;nowhere;nuclear;nude;nuisance;null;number;numbers;numeral;numerals;numerous;nurse;nursery;nut;nutrient;nutrients;nuts;nutshell;oar;oath;obedience;obedient;obey;object;objection;objective;objectives;objects;obligations;oblige;obliged;observation;observations;observe;observed;observers;obsolete;obstacle;obstruct;obtain;obtained;obvious;obviously;occasion;occasional;occasionally;occasions;occupation;occupied;occupy;occur;occurred;occurrence;occurring;occurs;ocean;oceans;october;odd;of;off;offence;offend;offense;offensive;offer;offered;offering;offerings;offers;officer;officers;offices;official;officials;officiate;offspring;often;oh;ohio;oil;okay;oklahoma;old;older;oldest;olympic;olympics;omission;omissions;omit;omitted;on;one;ones;online;only;onto;open;opened;opening;openings;openly;opens;opera;operate;operated;operating;operation;operational;operations;operator;operators;opinion;opinions;opponent;opportunities;oppose;opposed;opposite;opposition;optimal;option;or;oral;orange;orbit;order;ordered;orderly;orders;ordinarily;ordinary;oregon;organic;organization;organizations;organize;organized;orientate;oriented;origin;original;originally;originate;ornament;ornate;oscillate;other;others;otherwise;ought;ounce;ounces;our;ourselves;out;outcome;outdoor;outer;outfield;outline;outlook;output;outputs;outside;outstanding;outward;oven;over;overall;overcome;overdo;overdraw;overflow;overhead;overhear;overlap;overnight;overseas;oversee;overtake;overthrow;overturn;overused;overweight;overwhelming;owe;owen;owes;own;owned;owner;owners;ownership;owning;oxidation;oxygen;pacific;pack;package;packed;pad;paddle;page;pages;paid;pain;painful;paint;painted;painter;painting;paintings;pair;pakistan;palace;pale;pamela;pan;pancake;panic;papa;paper;paperback;papers;parade;paragraph;parallel;parasite;parasites;parcel;pardon;parent;parenthesis;parents;paris;park;parked;parking;parliament;part;partial;partially;participate;participation;particle;particles;particular;particularly;parties;partly;partner;parts;party;pass;passage;passages;passed;passenger;passengers;passes;passing;passion;passive;password;past;paste;pasted;pastry;pasture;pat;patent;path;patience;patient;patients;patricia;patrick;patriotic;patrol;pattern;patterns;paul;pause;paused;paw;pay;payback;paying;payment;payments;peace;peaceful;pearl;peas;peasant;peck;peculiar;pedal;peel;peep;pen;penalty;pencil;pendulum;pennsylvania;penny;people;peoples;pepper;per;perceive;percent;percentage;perception;perfect;perfection;perfectly;perform;performance;performances;performed;perhaps;period;periods;permanent;permission;permit;permits;permitted;perpendicular;perpetual;persist;person;personal;personality;personally;personnel;persons;perspective;persuade;persuaded;persuasion;pertinent;pervade;pet;peter;petitioner;phenomena;phenomenon;philadelphia;philip;philippines;phillip;philosophy;phone;photo;photograph;photography;phrase;physical;physically;physics;piano;pick;picked;picking;pickup;picture;pictured;pictures;pie;piece;pieces;pierce;pig;pigeon;pigs;pike;pile;pilot;pin;pinch;pine;pink;pinpoint;pioneer;pipe;pistol;pitch;pitcher;pity;place;placed;placement;places;placing;plain;plains;plan;plane;planes;planet;planetary;planets;planned;planning;plans;plant;planted;plants;plastic;plastics;plate;plates;platform;play;played;player;players;playground;playing;plays;plead;pleasant;please;pleased;pleasure;plenty;plot;plow;pluck;plug;plural;plus;pocket;podcast;poem;poems;poet;poetic;poetry;poets;point;pointed;pointing;points;poison;poke;poland;pole;police;policeman;policies;policy;polish;polite;political;politician;politicians;politics;pollution;pond;ponder;pont;pony;pool;poor;poorer;poorly;pop;popcorn;popular;population;porch;port;portion;pose;position;positions;positive;positively;possess;possessed;possession;possessor;possibilities;possibility;possible;possibly;post;postpone;postulate;pot;potato;potatoes;potential;pound;pounds;pour;poured;poverty;powder;power;powered;powerful;powers;practically;practice;practiced;practices;practise;pragmatic;prairie;praise;praised;pray;prayer;preach;preached;precede;preceding;precious;precipitate;precise;precisely;precision;predict;predicted;prefer;preference;preferences;preferred;prefers;prejudice;preliminary;premature;premier;premise;preparation;prepare;prepared;preparing;prescribe;presence;present;presentation;presented;presently;presents;preserve;preset;preside;president;press;pressed;pressing;pressure;pressures;prestige;presumably;presume;pretend;pretense;pretty;prevail;prevent;prevented;prevention;previous;previously;prey;price;prices;prick;pride;priest;primarily;primary;prime;primitive;prince;princess;principal;principle;principles;print;printed;prior;priority;prison;prisoners;privacy;private;privilege;prize;probabilities;probability;probable;probably;problem;problems;procedure;procedures;proceed;proceeded;process;processed;processes;processing;procession;proclaim;procure;procurement;produce;produced;producer;produces;producing;product;production;productive;products;profess;profession;professional;professionally;professor;profit;profits;profound;program;programming;programs;progress;prohibit;prohibited;prohibition;project;projects;prominent;promise;promised;promises;promising;promote;promotion;promotions;prompt;prompting;promptly;prone;pronounce;pronunciation;proof;proofread;propaganda;propagate;propensity;proper;properly;properties;property;proportion;proposal;proposals;propose;proposed;proprietor;prose;prospect;prospective;prospects;prosper;protect;protected;protecting;protection;protein;protest;protestant;proud;prove;proved;proves;provide;provided;providence;provider;providers;providing;province;provision;provisions;provocative;provoke;prudence;psychological;psychology;public;publication;publications;publicity;publicize;publicly;publish;published;publisher;pull;pulled;pulling;pump;pumped;punch;punctual;punctuation;puncture;punish;punishment;pupil;pupils;puppy;purchase;purchased;purchases;pure;purely;purple;purport;purpose;purposes;pursuant;pursue;push;pushed;pushing;put;puts;putting;puzzle;puzzling;qualification;qualifications;qualified;qualify;qualities;quality;quantity;quarrel;quart;quarter;quarters;quarts;queen;queries;query;question;questioned;questioning;questions;quickly;quicksand;quiet;quietly;quit;quite;quotation;quote;quoted;rabbit;race;rachel;racial;racing;radar;radiate;radiation;radio;radius;rail;railroad;rain;rainbow;raise;raised;raising;rake;ralph;ran;ranch;random;randomize;randy;rang;range;ranging;rank;ranks;rapid;rapidly;rarely;rate;rather;rating;ratio;rational;raw;ray;raymond;rays;razor;reach;reached;reaches;reaching;reaction;reactionary;reactions;read;reader;readers;readily;reading;ready;real;realign;realise;realism;realistic;reality;realization;realize;realized;really;rear;reason;reasonable;reasonably;reasons;rebecca;rebel;recall;recalled;receipt;receive;received;receives;receiving;recent;recently;reception;recipe;recognise;recognition;recognize;recognized;recommend;recommendation;recommendations;recommended;reconcile;record;recorded;recording;records;recovery;recreation;recruit;rectangle;recur;red;reduce;reduced;reducing;refer;reference;references;referred;refers;refine;reflect;reflected;reflecting;reflection;reflections;reflects;refrain;refresh;refrigerator;refund;refuse;refused;refute;regard;regarded;regarding;regardless;regards;regime;regiment;region;regional;regions;register;registered;registration;regret;regular;regularly;regulate;regulating;regulations;rehabilitation;reign;reinforce;reinforced;rejected;rejoice;relate;related;relation;relations;relationship;relationships;relative;relatively;relatives;relax;release;released;releases;relevance;relevant;reliable;relief;relieve;relieved;relieving;religion;religious;rely;remain;remainder;remained;remaining;remains;remark;remarkable;remarked;remarks;remedy;remember;remembered;remind;reminded;remote;removable;removal;remove;removed;removing;renaissance;render;rendered;rent;renter;reorganization;reorganize;repair;repeat;repeated;repetition;replace;replaced;replacement;replacements;replied;reply;report;reported;reporter;reporters;reports;represent;representative;representatives;represented;representing;represents;repress;reproduce;reproduction;republic;republican;republicans;reputation;request;require;required;requirement;requirements;requiring;rescue;research;researching;resent;reservation;reserved;reservoir;residence;resident;residential;residents;residue;resign;resistance;resolute;resolution;resolve;resolved;resonant;resource;resources;respect;respectable;respective;respectively;respects;respond;responded;response;responses;responsibilities;responsibility;responsible;rest;restated;restating;restaurant;restore;restored;restrict;restrictions;result;resulted;resulting;results;resumed;retail;retailers;retain;retained;retard;retire;retired;retirement;retrieve;return;returned;returning;returns;reveal;revealed;revenge;revenue;revenues;reverberate;reverend;reverse;review;revile;revise;revive;revolt;revolution;revolutionary;revolve;reward;rhode;rhyme;rhythm;ribbon;rice;rich;richard;rid;ridden;ride;ridge;riding;rifle;rifles;right;rightful;rights;rigid;rigor;ring;rings;rinse;ripe;ripen;rise;risen;rises;rising;risk;risked;risks;ritual;rival;rivalry;river;rivers;road;roads;roar;roast;roasted;rob;robbery;robert;rock;rocket;rocks;rocky;rod;rode;roger;role;roles;roll;rolled;rolling;roman;romania;romantic;rome;ronald;roof;room;roommate;rooms;root;roots;rose;rot;rotate;rotating;rotten;rough;roughly;round;rounded;roundup;route;routine;row;rows;roy;royal;royalty;rub;rubbed;rubber;rubbish;rude;rudely;rug;ruin;rule;ruled;ruler;rules;ruling;rumour;run;rung;running;runs;rural;rush;rushed;russell;russia;russian;russians;rust;ruth;ryan;sack;sacrifice;sad;sadden;saddle;sadly;safe;safeguard;safely;safer;safety;said;sail;sailboat;sailed;sailing;sailor;sailors;sake;salary;sale;sales;salesman;salmon;salon;salt;salvation;sam;samantha;same;sample;samples;sampling;samuel;sand;sandbox;sandpaper;sandra;sang;santa;sara;sarah;sat;satellite;satellites;satisfaction;satisfactory;satisfied;satisfy;saturate;saturday;saucer;savage;save;saved;saving;savings;saw;sawmill;say;saying;says;scalar;scale;scales;scan;scarce;scarcely;scare;scared;scatter;scattered;scene;scenery;scenes;schedule;scheduled;scheme;scholars;scholarship;school;schools;science;sciences;scientific;scientist;scientists;scissors;scold;scope;scorch;score;scorn;scott;scramble;scrambled;scrape;scratch;scream;screen;screw;scribble;script;scripts;scrub;sea;seal;sean;seaport;search;searching;seas;season;seat;seated;seats;second;secondary;secondly;seconds;secrecy;secret;secretary;secrete;secrets;section;sections;sector;secure;security;see;seed;seeds;seeing;seek;seeking;seem;seemed;seeming;seems;seen;sees;segment;seize;seized;seizing;seizure;seldom;select;selected;selection;self;selfish;sell;selling;sellout;selves;senate;senator;send;sender;sending;senior;sense;sensible;sensitive;sensitivity;sensual;sent;sentence;sentences;sentiment;separate;separated;separately;separation;september;sequence;sergeant;series;serious;seriously;servant;servants;serve;served;server;serves;service;services;serving;session;sessions;set;sets;setting;settings;settle;settled;settlement;settlers;seven;seventeen;seventh;seventy;several;severe;sew;sex;sexual;shade;shadow;shadows;shaft;shake;shaking;shall;shallow;shame;shape;shaped;shapes;share;shared;shares;sharing;sharon;sharp;sharpen;sharply;shave;she;shear;shed;sheep;sheet;sheets;shelf;shell;shells;shelter;shelters;sheriff;shes;shield;shielding;shift;shifted;shilling;shine;shining;shinning;ship;shipping;ships;shirley;shirt;shiver;shock;shoe;shoes;shoestring;shook;shoot;shooting;shop;shopper;shoppers;shopping;shore;short;shortcut;shorten;shorter;shortly;shorts;shot;shots;should;shoulder;shoulders;shouldn;shout;shouted;shouting;shovel;show;showed;shower;showing;shown;shows;shrink;shrinking;shrug;shuffle;shut;sibling;sick;side;sides;sidewalk;sigh;sighed;sight;sign;signal;signals;signature;significance;significant;signify;signs;silence;silencing;silent;silk;silly;silver;similar;similarly;simple;simplest;simplicity;simplify;simply;simultaneous;simultaneously;sin;since;sincere;sincerely;sing;singing;single;sink;sip;sir;sister;sisters;sit;site;sites;sitter;sitting;situation;situations;six;sixteen;sixth;sixties;size;sizes;sizzling;skeleton;sketch;ski;skill;skilled;skills;skin;skins;skip;skirt;sky;skype;slabs;slap;slave;slavery;slaves;slay;sleep;sleeping;slender;slept;slid;slide;slight;slightly;slim;sling;slink;slip;slipped;slippery;slit;slope;slow;slowed;slowly;small;smaller;smallest;smart;smash;smell;smile;smiled;smiling;smite;smith;smoke;smooth;snake;snakes;snapped;snatch;sneak;sneeze;sniff;snore;snow;snowman;snowstorm;so;soak;soap;social;socialist;societies;society;sock;socks;soft;soften;softly;software;soil;solar;sold;soldier;soldiers;solely;solid;solitary;solution;solutions;solve;solved;some;somebody;someday;somehow;someone;something;sometime;sometimes;somewhat;somewhere;son;song;songs;sons;soon;soothe;sophisticated;sorrow;sorry;sort;sorting;sought;soul;souls;sound;sounded;sounds;soup;sour;source;sources;south;southeast;southern;southerners;sovereign;sovereignty;soviet;sow;space;spaces;spaceship;spade;spain;spam;span;spanish;spare;spark;sparkle;spatial;speak;speaker;speaking;special;specialist;specialists;species;specific;specifically;specified;specify;specifying;specimen;spectrum;speculate;speech;speeches;speed;spell;spelled;spelling;spencer;spend;spending;spent;sphere;spider;spill;spine;spinning;spiral;spirit;spirits;spiritual;spit;spite;splendid;split;spoil;spoke;spoken;sponge;sponsor;sponsored;spontaneous;spoon;sport;sports;spot;spots;spouse;spray;sprayed;spread;spring;springs;sprout;square;squares;squash;squeak;squeal;st;stable;stadium;staff;stage;stain;staining;stair;stairs;stalk;stamp;stand;standards;standing;stands;star;stare;stared;staring;starlight;starring;stars;start;started;starting;startled;starts;starve;state;stated;statement;statements;states;station;stationary;stations;statistic;statistics;status;stay;steadily;steady;steal;steam;steel;steep;steer;stem;stems;step;stephanie;stephen;stepped;stepping;steps;stereotype;stern;steven;stick;sticks;sticky;stiff;stiffen;still;stimulate;sting;stings;stink;stipulate;stipulation;stir;stirring;stitch;stock;stockholders;stocking;stocks;stomach;stone;stones;stood;stop;stopped;stops;storage;store;stored;stores;stories;storm;stormy;story;storybook;stove;straight;straighten;strange;stranger;strap;strata;strategic;strategy;straw;stream;streaming;streamline;streams;street;streets;strength;strengthen;stress;stressed;stresses;stretch;stretched;strictly;stride;strike;strikes;striking;string;strip;stripe;strips;strive;stroke;strong;stronger;strongly;struck;structure;struggle;stuck;student;students;studied;studies;studio;study;studying;stuff;stumble;stumbled;stupid;stupidly;style;styles;subdivide;subjected;subjective;sublet;submerge;submitted;subordinate;subscription;subsequent;subside;subsidize;substance;substances;substantial;substantially;substrate;subtract;subtracting;suburban;succeed;success;successful;successfully;succession;sucessful;such;suck;sucks;sudden;suddenly;suffer;suffered;suffering;suffice;sufficiently;suffix;sugar;suggest;suggestion;suggestions;suggests;suit;suitable;suitcase;suite;suited;suits;sum;summarize;summary;summer;summertime;sun;sunburn;sunday;sunflower;sung;sunlight;superficial;superior;superstition;supervise;supervision;supper;supplement;supplemental;supplied;supplies;supply;support;supported;supporting;suppose;supposed;suppress;supreme;sure;surely;surface;surfboard;surplus;surprise;surprised;surprises;surprising;surrender;surround;surrounded;surrounding;survey;survival;survive;susan;suspect;suspected;suspend;suspended;suspicion;suspicious;sustain;sustained;swallow;swam;swear;sweat;sweden;sweep;sweeping;sweet;sweeten;swell;swept;swift;swim;swimming;swing;switch;switches;switzerland;swum;swung;syllable;syllables;symbol;symbolic;symbolize;symbols;sympathy;symptom;synchronous;synthetic;system;systems;table;tabulate;taco;tactics;tags;tail;tailor;take;taken;takes;taking;talent;talents;tales;talk;talked;talking;tall;tame;tammy;tangible;tank;tap;tape;target;targets;task;tasks;taste;taught;tax;taxi;taxpayers;taylor;tea;teacher;teachers;teacup;team;tear;tears;tease;teaspoon;tech;technical;technically;technique;techniques;technology;teenage;teeth;telephone;television;tell;telling;tells;temper;temperature;temperatures;temple;temporarily;temporary;tempt;ten;tend;tendency;tender;tends;tennessee;tense;tension;tent;tenth;teresa;term;terminal;terminology;terms;terrible;terribly;terrify;terror;terry;test;tested;testimony;tests;texas;text;textbook;textile;texting;texture;than;thank;thanks;thanksgiving;that;thats;thaw;the;theater;theatrical;thee;theft;their;theirs;them;themselves;then;theology;theorem;theoretical;theories;theory;therapy;there;thereafter;thereby;therefore;theres;theresa;these;they;theyre;thickness;thief;thin;thing;things;think;thinking;thinks;third;thirst;thirsty;thirteen;thirty;this;thomas;thorough;thoroughly;those;thou;though;thought;thoughts;thousand;thousands;thread;threat;threaten;threatened;threatening;three;threw;thrilled;thrive;throat;through;throughout;throw;thrown;thrust;thumb;thunder;thunderstorm;thursday;thus;thy;tick;ticket;tickle;tide;tidy;tie;tied;tiffany;tight;tighten;tightly;tile;till;time;times;timothy;tin;tiny;tip;tire;tired;tissue;title;to;toast;today;todays;toe;toes;together;told;tolerance;tolerant;tolerate;tommy;tomorrow;tone;tongue;tonight;tons;too;took;tool;tools;tooth;toothache;toothbrush;toothpaste;top;topic;tore;torn;torture;tossed;total;totally;touch;touchdown;touched;tour;tournament;tow;toward;towards;towel;tower;town;towns;toy;trace;traces;track;tracks;tractor;trade;trademark;traders;trading;tradition;traditional;traffic;tragedies;tragedy;tragic;trail;train;trained;training;trains;trait;tranquil;transact;transaction;transcribe;transfer;transferred;transform;transformation;transformed;transition;translate;translator;transmit;transparent;transport;transportation;trap;travel;traveled;traveling;travels;tray;tread;treasure;treasury;treat;treated;treaty;tree;trek;tremble;trembling;trend;trends;trial;trials;triangle;tribe;tribes;tribute;trick;tricks;tried;tries;trim;trip;triumph;trivial;troops;tropical;trouble;troubled;troubles;troubleshoot;truck;true;truly;trunk;trust;truth;try;trying;tsunami;tube;tubes;tuesday;tug;tumble;tumbled;tune;turkey;turn;turned;turning;turnout;turns;tutor;tv;tweet;twelve;twentieth;twenty;twice;twist;twitter;two;tyler;type;types;typical;ugly;ultimate;ultimately;umbrella;unable;uncertain;uncle;unclean;unconscious;under;undergo;underlie;underline;underlying;underneath;understand;understanding;understood;undertake;undeveloped;undo;undoing;undoubtedly;undress;unduly;uneasy;unemployment;unexpected;unexpectedly;unfasten;unfold;unfolding;unfortunately;unhappy;uniform;unify;union;unions;unit;unite;united;units;unity;universal;universe;universities;university;unknown;unless;unlike;unlikely;unlock;unnecessary;unpack;unrelated;unreliable;unscramble;untidy;until;unto;unusual;up;update;updated;upgrade;uphold;upon;upper;upright;upset;upstairs;upsurge;uptight;upward;upwards;urban;urge;urged;urgent;urging;us;usage;use;used;useful;user;users;uses;using;usual;usually;utility;utilize;utter;utterly;vacation;vague;vain;valid;valley;valleys;valuable;value;valued;values;van;vanish;vapor;vapour;variable;variables;variation;variations;varied;varieties;variety;various;vary;varying;vast;ve;vegetable;vegetables;vehicle;vehicles;vein;velocity;venezuela;venture;verb;verbal;verbs;verdict;verify;vermont;version;versus;vertical;very;vessel;vessels;veteran;vex;via;viable;vibrate;vibration;vice;victims;victoria;victory;video;view;viewed;viewing;views;vigorous;village;villages;vincent;vineyard;vintage;violate;violence;violent;virgin;virginia;virtual;virtually;virtue;virus;viscous;visible;vision;visit;visited;visiting;visitor;visual;vital;vivid;vogue;voice;voices;volt;volume;volumes;voluntary;voted;voter;voters;votes;voting;vowel;voyage;wage;wages;wagon;wagons;wail;waist;waistline;wait;waited;waiter;waiting;wake;walk;walked;walking;walks;wall;wallpaper;walls;walter;wander;want;wanted;war;warehouse;warfare;warm;warmth;warn;warning;warrant;wars;was;wash;washing;wasn;wasnt;waste;wasteful;watch;watched;watching;water;watered;waters;wave;waved;waves;wax;way;wayne;ways;we;weak;weaken;wealth;wealthy;weapon;weapons;wear;wearing;weary;weather;weave;web;webpage;website;wed;wednesday;weed;weeds;week;weekday;weekly;weeks;weep;weigh;weight;welcome;well;wend;went;were;weren;werent;west;western;wet;weve;whale;what;whatever;whats;wheat;wheel;wheels;when;whenever;where;whereas;whereby;whichever;while;whine;whip;whirl;whirlpool;whisky;whisper;whistle;white;whiten;whither;who;whole;wholly;whom;whose;why;wicked;wide;widely;widow;widower;width;wife;wild;wildlife;wildly;will;william;willie;win;wind;window;windows;winds;wine;wing;wink;winning;winter;wipe;wire;wires;wiring;wisdom;wise;wish;wishes;wit;with;withdraw;withhold;without;withstand;wobble;woes;woke;woken;wolf;woman;won;wonder;wondering;wont;wood;wooden;woods;wool;word;words;wore;work;worked;worker;workers;working;works;workshop;world;worlds;worm;worn;worried;worrying;worse;worship;worst;worth;would;wouldn;wouldnt;wound;wounded;wreck;wrestle;wright;wring;wrist;write;writer;writers;writing;yard;yards;yawn;yeah;year;years;yell;yellow;yes;yet;york;you;youd;youll;young;youngest;youre;yours;zachary;zero;zip;zone;th;zoo;deed;feed;edge;heed;idea;kick;like;mill;nine;once;pope;rope;spin;trot;utah;vote;wrap;your;zoom;added;raced;fence;wedge;teach;which;juice;thick;yield;theme;widen;women;wiped;quick;wrong;zones;wrote;youth;youve;worry;sixty;crazy;pizza;canada;decade;tended;office;sewage;washed;wished;reject;weaker;yelled;victim;within;zoomed;utopia;unique;wrongs;writes;worthy;vacuum;anyway;alabama;tobacco;radical;weekend;welfare;wedding;whether;wriggle;subject;yankees;willing;vietnam;wyoming;younger;wrapped;squeeze;written;witness;youtube;database;capacity;standard;wondered;surfaces;teaching;wherever;yielding;subjects;weakness;wireless;whomever;unwanted;yourself;synopsis;requires;visitors;trustees;available;practical;succeeded;yesterday;waterfall;suggested;whispered;worldwide;judgments;livestock;wonderful;treatment;wisconsin;youngster;uppermost;quarterly;territory;ambassador;vocabulary;scoreboard;widespread;sufficient;strategies;tightening;washington;adjustment;skyscraper;unemployed;tremendous;volunteers;yourselves;structural;substitute;spectacular;unscrambled;unscrambler;unconfirmed;underground;sympathetic;transmitted;conjunction;supermarket;translation;superimpose;unfortunate;opportunity;restructure;unsuccessful";
  const wordlistArray = wordlist.split(";");
  const wordlistSet = new Set(wordlistArray);

  const flipTable = {
    a: "\u0250", b: "q", c: "\u0254", d: "p", e: "\u01DD", f: "\u025F", g: "\u0183",
    h: "\u0265", i: "\u0131", j: "\u027E", k: "\u029E", l: "\u05DF", m: "\u026F",
    n: "u", r: "\u0279", t: "\u0287", v: "\u028C", w: "\u028D", y: "\u028E",
    ".": "\u02D9", "[": "]", "(": ")", "{": "}", "?": "\xBF", "!": "\xA1", "'": ",",
    "<": ">", _: "\u203E", '"': "\u201E", "\\": "\\", ";": "\u061B",
    "\u203F": "\u2040", "\u2045": "\u2046", "\u2234": "\u2235"
  };
  for (const k in flipTable) {
    if (!flipTable[flipTable[k]]) {
      flipTable[flipTable[k]] = k;
    }
  }

  const b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  function str4ToLong(s) {
    let v = 0;
    for (let i = 0; i < 4; i++) {
      v |= (s.charCodeAt(i) || 0) << (8 * i);
    }
    return isNaN(v) ? 0 : v;
  }

  function longToStr4(v) {
    return String.fromCharCode(v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >> 24) & 255);
  }

  function escCtrlCh(str) {
    return str.replace(/[\0\t\n\v\f\r\xa0'"!]/g, c => "!" + c.charCodeAt(0) + "!");
  }

  function unescCtrlCh(str) {
    return str.replace(/!\d+!/g, m => String.fromCharCode(parseInt(m.slice(1, -1), 10)));
  }

  function teaCode(v, k) {
    let y = v[0], z = v[1];
    let sum = 0;
    const delta = 2654435769;
    const n = 32;
    for (let i = 0; i < n; i++) {
      y = (y + (((z << 4) ^ (z >>> 5)) + z ^ (sum + k[sum & 3]))) | 0;
      sum = (sum + delta) | 0;
      z = (z + (((y << 4) ^ (y >>> 5)) + y ^ (sum + k[(sum >>> 11) & 3]))) | 0;
    }
    v[0] = y;
    v[1] = z;
  }

  function teaDecode(v, k) {
    let y = v[0], z = v[1];
    const delta = 2654435769;
    const n = 32;
    let sum = (delta * n) | 0;
    for (let i = 0; i < n; i++) {
      z = (z - (((y << 4) ^ (y >>> 5)) + y ^ (sum + k[(sum >>> 11) & 3]))) | 0;
      sum = (sum - delta) | 0;
      y = (y - (((z << 4) ^ (z >>> 5)) + z ^ (sum + k[sum & 3]))) | 0;
    }
    v[0] = y;
    v[1] = z;
  }

  function padZero(num, len) {
    let s = String(num);
    while (s.length < len) s = "0" + s;
    return s;
  }

  const TextEngine = {
    count(text, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      let processed = raw;
      if (options.skipHtml) {
        processed = processed.replace(/<[^>]*>/g, "");
      }

      let charCount = 0;
      if (options.noSpaces) {
        charCount = processed.replace(/[\r\n\s]/g, "").length;
      } else if (options.linebreakAsSpace) {
        charCount = processed.replace(/\n/g, " ").length;
      } else {
        charCount = processed.replace(/\n/g, "").length;
      }

      const wordsMatch = processed.match(/\b[\w\x27\u00C0-\u024F\u1E00-\u1EFF]+(?:-[\w\x27\u00C0-\u024F\u1E00-\u1EFF]+)*\b/gu);
      const wordCount = wordsMatch ? wordsMatch.length : 0;

      let sentCount = 0;
      if (processed.trim().length > 0) {
        const sentMatches = processed.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
        sentCount = sentMatches.length;
      }

      const lineCount = raw.length === 0 ? 0 : raw.split("\n").length;
      const byteCount = new TextEncoder().encode(raw).length;

      let customCount = 0;
      if (options.query) {
        try {
          const flags = options.caseSensitive ? "g" : "gi";
          const pat = options.regex ? options.query : options.query.replace(/[.*+?^=${}()|[\]\\\/]/g, "\\$&");
          const re = new RegExp(pat, flags);
          const m = raw.match(re);
          customCount = m ? m.length : 0;
        } catch (e) {
          customCount = 0;
        }
      }

      let wordFrequency = [];
      if (options.frequency && wordsMatch) {
        const freqMap = {};
        for (const w of wordsMatch) {
          const lower = w.toLowerCase();
          freqMap[lower] = (freqMap[lower] || 0) + 1;
        }
        wordFrequency = Object.entries(freqMap)
          .map(([word, count]) => ({
            word,
            count,
            percent: ((count / wordCount) * 100).toFixed(2)
          }))
          .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
      }

      return {
        characters: charCount,
        words: wordCount,
        sentences: sentCount,
        lines: lineCount,
        bytes: byteCount,
        customQueryCount: customCount,
        frequency: wordFrequency
      };
    },

    findAndReplace(text, find, replaceWith, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      if (find === "" || find === undefined || find === null) return { text: raw, matches: 0 };

      let flags = "";
      if (options.global !== false) flags += "g";
      if (!options.caseSensitive) flags += "i";
      if (options.multiline) flags += "m";

      let regex;
      try {
        if (options.regex) {
          regex = new RegExp(find, flags);
        } else {
          regex = new RegExp(find.replace(/[.*+?^=${}()|[\]\\\/]/g, "\\$&"), flags);
        }
      } catch (err) {
        return { text: raw, matches: 0, error: err.message };
      }

      const matchMatches = raw.match(regex);
      const count = matchMatches ? matchMatches.length : 0;
      const res = raw.replace(regex, replaceWith !== undefined ? replaceWith : "");
      return { text: res, matches: count };
    },

    changeCase(text, mode = "upper") {
      const raw = String(text || "").replace(/\r/g, "");
      switch (mode.toLowerCase()) {
        case "upper":
        case "uppercase":
          return raw.toUpperCase();
        case "lower":
        case "lowercase":
          return raw.toLowerCase();
        case "title":
        case "word":
        case "capitalize":
          return raw.replace(/\b([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF])([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase());
        case "sentence":
          return raw.replace(/(^|[.!?]\s+|\n\s*)([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF])/g, (_, boundary, char) => boundary + char.toUpperCase());
        case "random":
        case "randomcase":
        case "mock":
          return raw.split("").map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join("");
        case "camel":
        case "camelcase":
          return raw.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^([A-Z])/, (_, chr) => chr.toLowerCase());
        case "snake":
        case "snakecase":
          return raw.trim().replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase();
        case "kebab":
        case "kebabcase":
          return raw.trim().replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
        case "inverse":
        case "invert":
          return raw.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
        default:
          return raw;
      }
    },

    removeAccents(text) {
      const raw = String(text || "").replace(/\r/g, "");
      let count = 0;
      const chars = raw.split("");
      for (let i = 0; i < chars.length; i++) {
        const code = chars[i].charCodeAt(0);
        if (code > 124) {
          const idx = sec.indexOf(String(code));
          if (idx !== -1) {
            chars[i] = rep[idx];
            count++;
          }
        }
      }
      const res = chars.join("").normalize("NFD").replace(/[\u0300-\u036f]/g, () => {
        count++;
        return "";
      });
      return { text: res, removedCount: count };
    },

    removeSpaces(text, mode = "unwanted") {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      let resLines = [];

      switch (mode) {
        case "all":
          return { text: raw.replace(/[ \t]+/g, ""), mode: "all" };
        case "trim":
          resLines = lines.map(l => l.trim());
          return { text: resLines.join("\n"), mode: "trim" };
        case "collapse":
        case "unwanted":
        default:
          resLines = lines.map(l => l.trim().replace(/[ \t]{2,}/g, " "));
          return { text: resLines.join("\n"), mode: "unwanted" };
      }
    },

    addPrefixSuffix(text, prefix = "", suffix = "") {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      const res = lines.map(line => prefix + line + suffix);
      return res.join("\n");
    },

    lineBreaks(text, action = "remove", options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      if (action === "remove") {
        const replaceWith = options.replaceWith !== undefined ? options.replaceWith : "";
        return raw.replace(/\n/g, replaceWith);
      }
      if (action === "add_match") {
        const matchText = options.matchText || "";
        if (!matchText) return raw;
        let flags = options.caseSensitive ? "g" : "gi";
        const esc = matchText.replace(/[.*+?^=${}()|[\]\\\/]/g, "\\$&");
        const re = new RegExp("(" + esc + ")", flags);
        let cur = raw;
        if (options.removeExisting) cur = cur.replace(/\n/g, "");
        if (options.position === "before") {
          return cur.replace(re, "\n$1");
        } else {
          return cur.replace(re, "$1\n");
        }
      }
      if (action === "wrap" || action === "chunk") {
        const width = Math.max(1, parseInt(options.width || 80, 10));
        let cur = raw;
        if (options.removeExisting) cur = cur.replace(/\n/g, "");
        if (options.escapeExisting) cur = cur.replace(/\n/g, "\\n");

        if (options.wordWrap) {
          const lines = cur.split("\n");
          const wrapped = lines.map(line => {
            const words = line.split(" ");
            let curLine = "";
            const outLines = [];
            for (const word of words) {
              if ((curLine + (curLine ? " " : "") + word).length <= width) {
                curLine += (curLine ? " " : "") + word;
              } else {
                if (curLine) outLines.push(curLine);
                curLine = word;
              }
            }
            if (curLine) outLines.push(curLine);
            return outLines.join("\n");
          });
          return wrapped.join("\n");
        } else {
          const re = new RegExp(".{1," + width + "}", "g");
          const chunks = cur.match(re) || [];
          return chunks.join("\n");
        }
      }
      return raw;
    },

    joinLines(text, options = {}) {
      const delimiter = options.delimiter !== undefined ? options.delimiter : ", ";
      const prefix = options.prefix || "";
      const suffix = options.suffix || "";

      if (Array.isArray(text)) {
        const maxLines = Math.max(...text.map(col => col.split("\n").length));
        const sets = [];
        for (let i = 0; i < maxLines; i++) {
          const parts = text.map(col => {
            const lines = col.split("\n");
            return lines[i] !== undefined ? lines[i] : (options.fill || "");
          });
          sets.push(prefix + parts.join(delimiter) + suffix);
        }
        return sets.join(options.joinSets || "\n");
      }

      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      return prefix + lines.join(delimiter) + suffix;
    },

    removeDuplicates(text, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      const seen = new Set();
      const kept = [];
      const removed = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (options.removeEmpty && line.trim() === "") {
          removed.push({ index: i + 1, line, reason: "empty" });
          continue;
        }
        const key = options.caseSensitive ? line : line.toLowerCase();
        if (seen.has(key)) {
          removed.push({ index: i + 1, line, reason: "duplicate" });
        } else {
          seen.add(key);
          kept.push(line);
        }
      }

      return {
        text: kept.join("\n"),
        removedCount: removed.length,
        removedLines: removed
      };
    },

    removeEmptyLines(text, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      const removeWhitespaceOnly = options.whitespaceOnly !== false;
      const kept = [];
      let removedCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        const isEmpty = removeWhitespaceOnly ? l.trim() === "" : l === "";
        if (isEmpty) {
          removedCount++;
        } else {
          kept.push(l);
        }
      }

      return {
        text: kept.join("\n"),
        removedCount
      };
    },

    filterLines(text, pattern, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      const invert = options.invert || options.not || false;
      const caseSen = options.caseSensitive || false;

      let regex;
      if (Array.isArray(pattern)) {
        const escPatterns = pattern.map(p => options.regex ? p : p.replace(/[.*+?^=${}()|[\]\\\/]/g, "\\$&"));
        if (options.mode === "AND") {
          const combined = "(?=.*" + escPatterns.join(")(?=.*") + ")";
          regex = new RegExp(combined, caseSen ? "" : "i");
        } else {
          regex = new RegExp("(" + escPatterns.join("|") + ")", caseSen ? "" : "i");
        }
      } else {
        const p = options.regex ? pattern : String(pattern || "").replace(/[.*+?^=${}()|[\]\\\/]/g, "\\$&");
        regex = new RegExp(p, caseSen ? "" : "i");
      }

      const kept = [];
      const removed = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matches = regex.test(line);
        if ((matches && !invert) || (!matches && invert)) {
          kept.push(line);
        } else {
          removed.push({ index: i + 1, line });
        }
      }

      return {
        text: kept.join("\n"),
        keptCount: kept.length,
        removedCount: removed.length,
        removedLines: removed
      };
    },

    sortLines(text, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      const mode = options.mode || "alpha";
      const caseSen = !!options.caseSensitive;
      const reverse = !!options.reverse;
      const delimiter = options.delimiter !== undefined ? options.delimiter : "";
      const colNum = options.column ? parseInt(options.column, 10) - 1 : 0;

      function getColValue(line) {
        if (!delimiter) return line;
        const parts = line.split(delimiter);
        return parts[colNum] !== undefined ? parts[colNum] : "";
      }

      if (mode === "random" || mode === "shuffle") {
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        return lines.join("\n");
      }

      if (mode === "reverse_order") {
        return lines.reverse().join("\n");
      }

      if (mode === "length") {
        lines.sort((a, b) => {
          const diff = getColValue(a).length - getColValue(b).length;
          return reverse ? -diff : diff;
        });
        return lines.join("\n");
      }

      if (mode === "natural" || mode === "num" || mode === "numeric") {
        lines.sort((a, b) => {
          const valA = getColValue(a);
          const valB = getColValue(b);
          const res = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: caseSen ? "variant" : "base" });
          return reverse ? -res : res;
        });
        return lines.join("\n");
      }

      lines.sort((a, b) => {
        const valA = getColValue(a);
        const valB = getColValue(b);
        let cmp = 0;
        if (caseSen) {
          cmp = valA < valB ? -1 : (valA > valB ? 1 : 0);
        } else {
          cmp = valA.toLowerCase().localeCompare(valB.toLowerCase());
        }
        return reverse ? -cmp : cmp;
      });

      return lines.join("\n");
    },

    generateNumbers(start = 1, end = 100, options = {}) {
      const s = parseInt(start, 10) || 1;
      const e = parseInt(end, 10) || 100;
      const step = parseInt(options.step, 10) || (s <= e ? 1 : -1);
      const prefix = options.prefix || "";
      const suffix = options.suffix || "";
      const delimiter = options.delimiter !== undefined ? options.delimiter : "\n";
      const pad = !!options.pad;

      const maxDigits = String(Math.max(Math.abs(s), Math.abs(e))).length;
      const res = [];

      if (step > 0) {
        for (let n = s; n <= e; n += step) {
          const numStr = pad ? padZero(n, maxDigits) : String(n);
          res.push(prefix + numStr + suffix);
        }
      } else {
        for (let n = s; n >= e; n += step) {
          const numStr = pad ? padZero(n, maxDigits) : String(n);
          res.push(prefix + numStr + suffix);
        }
      }

      return res.join(delimiter);
    },

    numberLines(text, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      const start = parseInt(options.start, 10) || 1;
      const position = options.position || "left";
      const prefix = options.prefix || "";
      const suffix = options.suffix !== undefined ? options.suffix : ". ";
      const pad = !!options.pad;
      const total = lines.length;
      const maxDigits = String(start + total - 1).length;

      const res = lines.map((line, idx) => {
        const currentNum = start + idx;
        const formattedNum = pad ? padZero(currentNum, maxDigits) : String(currentNum);
        if (position === "right") {
          return line + prefix + formattedNum + suffix;
        } else {
          return prefix + formattedNum + suffix + line;
        }
      });

      return res.join("\n");
    },

    binaryCode(text, mode = "encode", options = {}) {
      const raw = String(text || "");
      const spaces = options.spaces !== false;

      if (mode === "decode" || mode === "binary2text") {
        let clean = raw.replace(/[\r\n]/g, " ").trim();
        let tokens = clean.split(/\s+/);
        if (tokens.length === 1 && tokens[0].length >= 8 && !tokens[0].includes(" ")) {
          tokens = tokens[0].match(/.{1,8}/g) || [];
        }
        const decoded = tokens.map(bin => {
          const code = parseInt(bin, 2);
          return isNaN(code) ? "" : String.fromCharCode(code);
        }).join("");
        return decoded;
      }

      const lines = raw.replace(/\r/g, "").split("\n");
      const encodedLines = lines.map(line => {
        const bytes = [];
        for (let i = 0; i < line.length; i++) {
          const bin = line.charCodeAt(i).toString(2);
          bytes.push(padZero(bin, 8));
        }
        return bytes.join(spaces ? " " : "");
      });

      return encodedLines.join(spaces ? "\n" : "");
    },

    disemvowel(text, options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      const vowels = (options.vowels || "aeiouAEIOU").split("");
      const vowelSet = new Set(vowels);
      const res = raw.split("").filter(c => !vowelSet.has(c)).join("");
      return res;
    },

    revowel(disemvoweledWord) {
      const target = this.disemvowel(String(disemvoweledWord || "").toLowerCase().trim());
      if (!target) return [];
      const matches = [];
      for (const word of wordlistArray) {
        if (this.disemvowel(word.toLowerCase()) === target) {
          matches.push(word);
        }
      }
      return matches;
    },

    encryptTEA(text, password) {
      if (!password) throw new Error("Password is required for encryption");
      const raw = escape(String(text || "").replace(/\r/g, ""));
      const pass = String(password);

      const k = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) {
        k[i] = str4ToLong(pass.slice(4 * i, 4 * (i + 1)));
      }

      let encrypted = "";
      const v = [0, 0];
      for (let i = 0; i < raw.length; i += 8) {
        v[0] = str4ToLong(raw.slice(i, i + 4));
        v[1] = str4ToLong(raw.slice(i + 4, i + 8));
        teaCode(v, k);
        encrypted += longToStr4(v[0]) + longToStr4(v[1]);
      }

      const escaped = escCtrlCh(encrypted);
      let b64 = "";
      let i = 0;
      while (i < escaped.length) {
        const c1 = escaped.charCodeAt(i++);
        const c2 = escaped.charCodeAt(i++);
        const c3 = escaped.charCodeAt(i++);
        const enc1 = c1 >> 2;
        const enc2 = ((c1 & 3) << 4) | (c2 >> 4);
        let enc3 = ((c2 & 15) << 2) | (c3 >> 6);
        let enc4 = c3 & 63;
        if (isNaN(c2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(c3)) {
          enc4 = 64;
        }
        b64 += b64chars.charAt(enc1) + b64chars.charAt(enc2) + b64chars.charAt(enc3) + b64chars.charAt(enc4);
      }
      return b64;
    },

    decryptTEA(ciphertext, password) {
      if (!password) throw new Error("Password is required for decryption");
      let clean = String(ciphertext || "").replace(/[^A-Za-z0-9+/=]/g, "");
      const pass = String(password);

      const k = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) {
        k[i] = str4ToLong(pass.slice(4 * i, 4 * (i + 1)));
      }

      let unb64 = "";
      let i = 0;
      while (i < clean.length) {
        const enc1 = b64chars.indexOf(clean.charAt(i++));
        const enc2 = b64chars.indexOf(clean.charAt(i++));
        const enc3 = b64chars.indexOf(clean.charAt(i++));
        const enc4 = b64chars.indexOf(clean.charAt(i++));

        const c1 = (enc1 << 2) | (enc2 >> 4);
        const c2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        const c3 = ((enc3 & 3) << 6) | enc4;

        unb64 += String.fromCharCode(c1);
        if (enc3 !== 64) unb64 += String.fromCharCode(c2);
        if (enc4 !== 64) unb64 += String.fromCharCode(c3);
      }

      const unescaped = unescCtrlCh(unb64);
      let decrypted = "";
      const v = [0, 0];
      for (let j = 0; j < unescaped.length; j += 8) {
        v[0] = str4ToLong(unescaped.slice(j, j + 4));
        v[1] = str4ToLong(unescaped.slice(j + 4, j + 8));
        teaDecode(v, k);
        decrypted += longToStr4(v[0]) + longToStr4(v[1]);
      }

      return unescape(decrypted.replace(/\0+$/, ""));
    },

    generatePassword(len = 16) {
      const length = Math.max(4, parseInt(len, 10) || 16);
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*-+=?";
      let pass = "";
      for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pass;
    },

    reverseFlip(text, mode = "reverse") {
      const raw = String(text || "").replace(/\r/g, "");
      switch (mode.toLowerCase()) {
        case "reverse":
        case "text":
          return raw.split("").reverse().join("");
        case "words":
        case "reverse_words":
          return raw.split("\n").map(line => line.split(" ").reverse().join(" ")).join("\n");
        case "letters":
        case "reverse_word_letters":
          return raw.split("\n").map(line => line.split(" ").map(w => w.split("").reverse().join("")).join(" ")).join("\n");
        case "flip":
        case "flip_text":
          return raw.split("\n").map(line => {
            return line.split("").reverse().map(c => flipTable[c] || c).join("");
          }).join("\n");
        case "upsidedown":
        case "upside_down":
          return raw.toLowerCase().split("").reverse().map(c => flipTable[c] || c).join("");
        default:
          return raw.split("").reverse().join("");
      }
    },

    rot13(text, shift = 13) {
      const raw = String(text || "");
      const s = ((shift % 26) + 26) % 26;
      return raw.replace(/[a-zA-Z]/g, c => {
        const base = c >= "a" && c <= "z" ? 97 : 65;
        return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
      });
    },

    scrambleWords(text) {
      const raw = String(text || "");
      return raw.replace(/\b([a-zA-Z])([a-zA-Z]{2,})([a-zA-Z])\b/g, (_, first, middle, last) => {
        const arr = middle.split("");
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return first + arr.join("") + last;
      });
    },

    descrambleWords(text) {
      const raw = String(text || "");
      return raw.replace(/\b([a-zA-Z]+)\b/g, word => {
        const lower = word.toLowerCase();
        if (wordlistSet.has(lower)) return word;
        const sorted = lower.split("").sort().join("");
        const candidate = wordlistArray.find(w => w.length === lower.length && w.split("").sort().join("") === sorted);
        if (candidate) {
          if (word[0] === word[0].toUpperCase()) {
            return candidate.charAt(0).toUpperCase() + candidate.slice(1);
          }
          return candidate;
        }
        return word;
      });
    },

    combinations(items, k = 2, options = {}) {
      const inputArr = Array.isArray(items) ? items : String(items || "").replace(/\r/g, "").split("\n").filter(Boolean);
      const len = inputArr.length;
      const comboSize = Math.max(1, parseInt(k, 10) || 1);
      const repeat = !!options.repeat;
      const prefix = options.prefix || "";
      const suffix = options.suffix || "";
      const delimiter = options.delimiter !== undefined ? options.delimiter : "";
      const joinSets = options.joinSets !== undefined ? options.joinSets : "\n";

      const maxLimit = options.maxLimit || 10000;
      const results = [];

      function combineWithRepeat(prefixArr, depth) {
        if (results.length >= maxLimit) return;
        if (depth === comboSize) {
          results.push(prefix + prefixArr.join(delimiter) + suffix);
          return;
        }
        for (let i = 0; i < len; i++) {
          combineWithRepeat([...prefixArr, inputArr[i]], depth + 1);
          if (results.length >= maxLimit) return;
        }
      }

      function combineNoRepeat(start, prefixArr) {
        if (results.length >= maxLimit) return;
        if (prefixArr.length === comboSize) {
          results.push(prefix + prefixArr.join(delimiter) + suffix);
          return;
        }
        for (let i = start; i < len; i++) {
          combineNoRepeat(i + 1, [...prefixArr, inputArr[i]]);
          if (results.length >= maxLimit) return;
        }
      }

      if (repeat) {
        combineWithRepeat([], 0);
      } else {
        combineNoRepeat(0, []);
      }

      return results.join(joinSets);
    },

    permutations(items, options = {}) {
      const inputArr = Array.isArray(items) ? items : String(items || "").replace(/\r/g, "").split("\n").filter(Boolean);
      const prefix = options.prefix || "";
      const suffix = options.suffix || "";
      const delimiter = options.delimiter !== undefined ? options.delimiter : "";
      const joinSets = options.joinSets !== undefined ? options.joinSets : "\n";
      const maxLimit = options.maxLimit || 10000;
      const results = [];

      function permuteHelper(arr, memo = []) {
        if (results.length >= maxLimit) return;
        if (arr.length === 0) {
          results.push(prefix + memo.join(delimiter) + suffix);
          return;
        }
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          permuteHelper(curr.slice(), memo.concat(next));
          if (results.length >= maxLimit) return;
        }
      }

      permuteHelper(inputArr);
      return results.join(joinSets);
    },

    randomNumbers(count = 10, min = 1, max = 1000, options = {}) {
      const c = Math.max(1, parseInt(count, 10) || 10);
      const low = parseInt(min, 10) || 1;
      const high = parseInt(max, 10) || 1000;
      const prefix = options.prefix || "";
      const suffix = options.suffix || "";
      const delimiter = options.delimiter !== undefined ? options.delimiter : "\n";
      const pad = !!options.pad;
      const maxLen = String(Math.max(Math.abs(low), Math.abs(high))).length;

      const res = [];
      for (let i = 0; i < c; i++) {
        const val = Math.floor(Math.random() * (high - low + 1)) + low;
        const strVal = pad ? padZero(val, maxLen) : String(val);
        res.push(prefix + strVal + suffix);
      }

      return res.join(delimiter);
    },

    randomStrings(count = 10, length = 14, charset = "", options = {}) {
      const c = Math.max(1, parseInt(count, 10) || 10);
      const len = Math.max(1, parseInt(length, 10) || 14);
      const pool = charset || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const prefix = options.prefix || "";
      const suffix = options.suffix || "";
      const elemDelim = options.elemDelim || "";
      const setDelim = options.setDelim !== undefined ? options.setDelim : "\n";

      const res = [];
      for (let i = 0; i < c; i++) {
        const chars = [];
        for (let j = 0; j < len; j++) {
          chars.push(pool.charAt(Math.floor(Math.random() * pool.length)));
        }
        res.push(prefix + chars.join(elemDelim) + suffix);
      }

      return res.join(setDelim);
    },

    randomizeString(text, delimiter = "") {
      const raw = String(text || "");
      if (delimiter) {
        const tokens = raw.split(delimiter);
        for (let i = tokens.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tokens[i], tokens[j]] = [tokens[j], tokens[i]];
        }
        return tokens.join(delimiter);
      } else {
        const chars = raw.split("");
        for (let i = chars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join("");
      }
    },

    extractColumn(text, delimiter = ",", colNum = 1) {
      const raw = String(text || "").replace(/\r/g, "");
      const lines = raw.split("\n");
      const targetCol = Math.max(0, (parseInt(colNum, 10) || 1) - 1);
      const delim = delimiter !== undefined ? delimiter : ",";

      const extracted = lines.map(line => {
        if (!delim) return line[targetCol] || "";
        const parts = line.split(delim);
        return parts[targetCol] !== undefined ? parts[targetCol] : "";
      });

      return extracted.join("\n");
    },

    unicodeConvert(text, format = "html_dec", options = {}) {
      const raw = String(text || "").replace(/\r/g, "");
      const left = options.leftDelim !== undefined ? options.leftDelim : "";
      const right = options.rightDelim !== undefined ? options.rightDelim : "";
      const skipChars = options.skipChars || "";
      const onlyChars = options.onlyChars || "";
      const skipSet = new Set(skipChars.split(""));
      const onlySet = onlyChars ? new Set(onlyChars.split("")) : null;

      const lines = raw.split("\n");
      const convertedLines = lines.map(line => {
        const out = [];
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (skipSet.has(char) || (onlySet && !onlySet.has(char))) {
            out.push(char);
            continue;
          }
          const code = char.charCodeAt(0);
          switch (format.toLowerCase()) {
            case "html_dec":
            case "num":
              out.push((left || "&#") + code + (right || ";"));
              break;
            case "html_hex":
            case "hex":
              out.push((left || "&#x") + code.toString(16).toUpperCase() + (right || ";"));
              break;
            case "utf16_hex":
            case "hex16":
              out.push((left || "\\u") + padZero(code.toString(16).toUpperCase(), 4) + (right || ""));
              break;
            case "utf16_dec":
            case "num16":
              out.push((left || "") + code + (right || ""));
              break;
            case "c_source":
            case "hexsource":
              out.push((left || "\\x") + padZero(code.toString(16).toUpperCase(), 2) + (right || ""));
              break;
            case "codepoint":
              out.push("U+" + padZero(code.toString(16).toUpperCase(), 4));
              break;
            default:
              out.push((left || "&#") + code + (right || ";"));
          }
        }
        return out.join("");
      });

      return convertedLines.join("\n");
    },

    urlEncode(text, options = {}) {
      const raw = String(text || "");
      const encObj = typeof Encoding !== "undefined" ? Encoding : (typeof root !== "undefined" && root.Encoding ? root.Encoding : null);
      if (encObj && options.encoding && options.encoding.toUpperCase() !== "UTF8" && options.encoding.toUpperCase() !== "UNICODE") {
        const codeArray = encObj.convert(encObj.stringToCode(raw), {
          to: options.encoding.toUpperCase(),
          from: "UNICODE"
        });
        return encObj.urlEncode(codeArray);
      }
      if (options.component === false) {
        return encodeURI(raw);
      }
      return encodeURIComponent(raw);
    },

    urlDecode(text, options = {}) {
      const raw = String(text || "");
      const encObj = typeof Encoding !== "undefined" ? Encoding : (typeof root !== "undefined" && root.Encoding ? root.Encoding : null);
      if (encObj && options.encoding && options.encoding.toUpperCase() !== "UTF8" && options.encoding.toUpperCase() !== "UNICODE") {
        const decodedCodes = encObj.urlDecode(raw);
        const unicodeArray = encObj.convert(decodedCodes, {
          to: "UNICODE",
          from: options.encoding.toUpperCase()
        });
        return encObj.codeToString(unicodeArray);
      }
      try {
        return decodeURIComponent(raw.replace(/\+/g, " "));
      } catch (e) {
        if (encObj) {
          const decodedCodes = encObj.urlDecode(raw);
          const detected = encObj.detect(decodedCodes);
          const unicodeArray = encObj.convert(decodedCodes, {
            to: "UNICODE",
            from: detected || "SJIS"
          });
          return encObj.codeToString(unicodeArray);
        }
        return unescape(raw);
      }
    },

    base64Encode(text, options = {}) {
      const raw = String(text || "");
      const encObj = typeof Encoding !== "undefined" ? Encoding : (typeof root !== "undefined" && root.Encoding ? root.Encoding : null);
      if (encObj && options.encoding && options.encoding.toUpperCase() !== "UTF8" && options.encoding.toUpperCase() !== "UNICODE") {
        const codeArray = encObj.convert(encObj.stringToCode(raw), {
          to: options.encoding.toUpperCase(),
          from: "UNICODE"
        });
        return encObj.base64Encode(codeArray);
      }
      if (typeof btoa !== "undefined") {
        return btoa(unescape(encodeURIComponent(raw)));
      }
      if (typeof Buffer !== "undefined") {
        return Buffer.from(raw, "utf8").toString("base64");
      }
      return "";
    },

    base64Decode(text, options = {}) {
      const raw = String(text || "").trim();
      const encObj = typeof Encoding !== "undefined" ? Encoding : (typeof root !== "undefined" && root.Encoding ? root.Encoding : null);
      if (encObj && options.encoding && options.encoding.toUpperCase() !== "UTF8" && options.encoding.toUpperCase() !== "UNICODE") {
        const decodedCodes = encObj.base64Decode(raw);
        const unicodeArray = encObj.convert(decodedCodes, {
          to: "UNICODE",
          from: options.encoding.toUpperCase()
        });
        return encObj.codeToString(unicodeArray);
      }
      if (typeof atob !== "undefined") {
        try {
          return decodeURIComponent(escape(atob(raw)));
        } catch (e) {
          if (encObj) {
            const decodedCodes = encObj.base64Decode(raw);
            const detected = encObj.detect(decodedCodes);
            const unicodeArray = encObj.convert(decodedCodes, {
              to: "UNICODE",
              from: detected || "AUTO"
            });
            return encObj.codeToString(unicodeArray);
          }
          throw e;
        }
      }
      if (typeof Buffer !== "undefined") {
        return Buffer.from(raw, "base64").toString("utf8");
      }
      return "";
    },

    detectEncoding(text) {
      const encObj = typeof Encoding !== "undefined" ? Encoding : (typeof root !== "undefined" && root.Encoding ? root.Encoding : null);
      if (encObj) {
        let codeArray;
        if (typeof text === "string") {
          codeArray = encObj.stringToCode(text);
        } else {
          codeArray = text;
        }
        return encObj.detect(codeArray) || "UNKNOWN";
      }
      return "UTF-8";
    },

    convertEncoding(text, to = "UTF8", from = "AUTO", options = {}) {
      const encObj = typeof Encoding !== "undefined" ? Encoding : (typeof root !== "undefined" && root.Encoding ? root.Encoding : null);
      if (!encObj) return text;
      const raw = String(text || "");
      const codeArray = encObj.stringToCode(raw);
      const converted = encObj.convert(codeArray, {
        to: to.toUpperCase(),
        from: from ? from.toUpperCase() : "AUTO",
        fallback: options.fallback || "html-entity",
        bom: options.bom
      });
      if (to.toUpperCase() === "UNICODE") {
        return encObj.codeToString(converted);
      }
      if (options.format === "url") {
        return encObj.urlEncode(converted);
      }
      if (options.format === "hex") {
        return converted.map(c => (c < 16 ? "0" : "") + c.toString(16).toUpperCase()).join(" ");
      }
      if (options.format === "base64") {
        return encObj.base64Encode(converted);
      }
      return encObj.codeToString(converted);
    },

    zenkakuHankaku(text, mode = "hankaku") {
      const encObj = typeof Encoding !== "undefined" ? Encoding : (typeof root !== "undefined" && root.Encoding ? root.Encoding : null);
      if (!encObj) return text;
      const raw = String(text || "");
      switch (mode.toLowerCase()) {
        case "hankaku":
        case "to_hankaku":
          return encObj.toHankakuCase(raw);
        case "zenkaku":
        case "to_zenkaku":
          return encObj.toZenkakuCase(raw);
        case "hiragana":
        case "to_hiragana":
          return encObj.toHiraganaCase(raw);
        case "katakana":
        case "to_katakana":
          return encObj.toKatakanaCase(raw);
        case "hankana":
        case "to_hankana":
          return encObj.toHankanaCase(raw);
        case "zenkana":
        case "to_zenkana":
          return encObj.toZenkanaCase(raw);
        case "space_hankaku":
          return encObj.toHankakuSpace(raw);
        case "space_zenkaku":
          return encObj.toZenkakuSpace(raw);
        default:
          return encObj.toHankakuCase(raw);
      }
    },

    punycodeEncode(text, options = {}) {
      const raw = String(text || "");
      const puny = typeof punycode !== "undefined" ? punycode : (typeof root !== "undefined" && root.punycode ? root.punycode : null);
      if (!puny) return raw;

      const lines = raw.replace(/\r/g, "").split("\n");
      const mode = options.mode || (options.domain || options.idn ? "domain" : "auto");

      const converted = lines.map(line => {
        if (!line.trim()) return line;
        if (mode === "raw") {
          return puny.encode(line);
        }
        if (mode === "domain" || mode === "idn" || mode === "ascii") {
          return puny.toASCII(line);
        }
        if (line.includes(".") || line.includes("@")) {
          return puny.toASCII(line);
        }
        return puny.encode(line);
      });

      return converted.join("\n");
    },

    punycodeDecode(text, options = {}) {
      const raw = String(text || "");
      const puny = typeof punycode !== "undefined" ? punycode : (typeof root !== "undefined" && root.punycode ? root.punycode : null);
      if (!puny) return raw;

      const lines = raw.replace(/\r/g, "").split("\n");
      const mode = options.mode || (options.domain || options.idn ? "domain" : "auto");

      const converted = lines.map(line => {
        if (!line.trim()) return line;
        if (mode === "raw") {
          try {
            return puny.decode(line);
          } catch (e) {
            return line;
          }
        }
        if (mode === "domain" || mode === "idn" || mode === "unicode") {
          return puny.toUnicode(line);
        }
        if (line.startsWith("xn--") || line.includes(".xn--") || line.includes(".")) {
          return puny.toUnicode(line);
        }
        try {
          return puny.decode(line);
        } catch (e) {
          return puny.toUnicode(line);
        }
      });

      return converted.join("\n");
    },

    ucs2Decode(text) {
      const puny = typeof punycode !== "undefined" ? punycode : (typeof root !== "undefined" && root.punycode ? root.punycode : null);
      if (puny && puny.ucs2) {
        return puny.ucs2.decode(String(text || ""));
      }
      const raw = String(text || "");
      const out = [];
      for (const char of raw) {
        out.push(char.codePointAt(0));
      }
      return out;
    },

    ucs2Encode(codePoints) {
      const puny = typeof punycode !== "undefined" ? punycode : (typeof root !== "undefined" && root.punycode ? root.punycode : null);
      if (puny && puny.ucs2) {
        return puny.ucs2.encode(codePoints);
      }
      return String.fromCodePoint(...codePoints);
    },

    diffMaps(map1Input, map2Input, options = {}) {
      let map1, map2;
      try {
        if (typeof map1Input === 'string') {
          const trimmed = map1Input.trim();
          if ((!map2Input || map2Input === '') && trimmed.startsWith('{')) {
            const match = trimmed.match(/^(\{[\s\S]*?\})\s*(\{[\s\S]*?\})$/);
            if (match) {
              map1 = JSON.parse(match[1]);
              map2 = JSON.parse(match[2]);
            } else {
              map1 = JSON.parse(trimmed);
            }
          } else {
            map1 = JSON.parse(trimmed);
          }
        } else {
          map1 = map1Input || {};
        }
      } catch (e) {
        return {
          error: "Invalid JSON input for Map 1: " + e.message,
          isError: true,
          textReport: "Error: Invalid JSON for Map 1 (" + e.message + ")",
          htmlReport: '<span class="c-err">Error: Invalid JSON for Map 1 (' + (e.message || '') + ')</span>'
        };
      }

      if (map2 === undefined) {
        try {
          if (typeof map2Input === 'string') {
            map2 = JSON.parse(map2Input.trim());
          } else {
            map2 = map2Input || {};
          }
        } catch (e) {
          return {
            error: "Invalid JSON input for Map 2: " + e.message,
            isError: true,
            textReport: "Error: Invalid JSON for Map 2 (" + e.message + ")",
            htmlReport: '<span class="c-err">Error: Invalid JSON for Map 2 (' + (e.message || '') + ')</span>'
          };
        }
      }

      const missingInMap2 = {};
      const missingInMap1 = {};
      const mismatched = {};

      for (const [key, val] of Object.entries(map1)) {
        if (!(key in map2)) {
          missingInMap2[key] = val;
        } else {
          const v1 = val;
          const v2 = map2[key];
          const isMatch = (typeof v1 === 'object' && v1 !== null && typeof v2 === 'object' && v2 !== null)
            ? JSON.stringify(v1) === JSON.stringify(v2)
            : (v1 === v2);
          if (!isMatch) {
            mismatched[key] = { expected: val, actual: map2[key] };
          }
        }
      }

      for (const [key, val] of Object.entries(map2)) {
        if (!(key in map1)) {
          missingInMap1[key] = val;
        }
      }

      const identical = Object.keys(missingInMap2).length === 0 &&
        Object.keys(missingInMap1).length === 0 &&
        Object.keys(mismatched).length === 0;

      let textReport = "";
      if (Object.keys(missingInMap2).length > 0) {
        textReport += `Missing in Map 2:\n${JSON.stringify(missingInMap2, null, 2)}\n\n`;
      }
      if (Object.keys(missingInMap1).length > 0) {
        textReport += `Extra in Map 2:\n${JSON.stringify(missingInMap1, null, 2)}\n\n`;
      }
      if (Object.keys(mismatched).length > 0) {
        textReport += `Mismatched values:\n`;
        for (const key in mismatched) {
          const pair = mismatched[key];
          const expStr = typeof pair.expected === 'object' ? JSON.stringify(pair.expected) : String(pair.expected);
          const actStr = typeof pair.actual === 'object' ? JSON.stringify(pair.actual) : String(pair.actual);
          textReport += `  ${key}: expected "${expStr}", actual "${actStr}"\n`;
        }
        textReport += '\n';
      }
      if (identical) {
        textReport = "Maps are identical!\n";
      }

      function esc(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      let htmlReport = "";
      if (Object.keys(missingInMap2).length > 0) {
        htmlReport += `<div class="diff-section"><span class="c-err ansi-bold">Missing in Map 2:</span>\n<span class="c-err">${esc(JSON.stringify(missingInMap2, null, 2))}</span></div>\n`;
      }
      if (Object.keys(missingInMap1).length > 0) {
        htmlReport += `<div class="diff-section"><span class="c-accent ansi-bold">Extra in Map 2:</span>\n<span class="c-accent">${esc(JSON.stringify(missingInMap1, null, 2))}</span></div>\n`;
      }
      if (Object.keys(mismatched).length > 0) {
        htmlReport += `<div class="diff-section"><span class="c-user ansi-bold">Mismatched values:</span>\n`;
        for (const key in mismatched) {
          const pair = mismatched[key];
          const expStr = typeof pair.expected === 'object' ? JSON.stringify(pair.expected) : String(pair.expected);
          const actStr = typeof pair.actual === 'object' ? JSON.stringify(pair.actual) : String(pair.actual);
          htmlReport += `  ${esc(key)}: expected "<span class="c-err">${esc(expStr)}</span>", actual "<span class="c-accent">${esc(actStr)}</span>"\n`;
        }
        htmlReport += `</div>\n`;
      }
      if (identical) {
        htmlReport = `<span class="c-accent ansi-bold">✓ Maps are identical!</span>`;
      }

      return {
        missingInMap2,
        missingInMap1,
        mismatched,
        identical,
        diffCount: Object.keys(missingInMap2).length + Object.keys(missingInMap1).length + Object.keys(mismatched).length,
        textReport: textReport.trim(),
        htmlReport
      };
    },

    bijoyToUnicode(text) {
      if (!text) return "";
      let processed = String(text);
      const bijoy_map = {
        "|": "।", "i¨": "র‌্য", "ª¨": "্র্য", "°": "ক্ক", "±": "ক্ট", "³": "ক্ত",
        "K¡": "ক্ব", "µ": "ক্র", "K¬": "ক্ল", "¶": "ক্ষ", "¨y": "্যু", "®ú": "ষ্প",
        "ÿ": "ক্ষ", "·": "ক্স", "¸": "গু", "»": "গ্ধ", "Mœ": "গ্ন", "¤§": "ম্ম",
        "M¥": "গ্ম", "M­": "গ্ল", "¼": "ঙ্ক", "•¶": "ঙ্ক্ষ", "•L": "ঙ্খ", "½": "ঙ্গ",
        "•N": "ঙ্ঘ", "”P": "চ্চ", "”Q": "চ্ছ", "”Q¡": "চ্ছ্ব", "”T": "চ্ঞ", "¾¡": "জ্জ্ব",
        "g¥": "ম্ন", "¾": "জ্জ", "fz¨": "ভ্যু", "À": "জ্ঝ", "Á": "জ্ঞ", "R¡": "জ্ব",
        "Â": "ঞ্চ", "Ã": "ঞ্ছ", "Ä": "ঞ্জ", "Å": "ঞ্ঝ", "Æ": "ট্ট", "U¡": "ট্ব",
        "U¥": "ট্ম", "Ç": "ড্ড", "È": "ণ্ট", "É": "ণ্ঠ", "Ý": "ন্স", "Ê": "ণ্ড",
        "š‘": "ন্তু", "Y^": "ণ্ব", "Ë": "ত্ত", "Ë¡": "ত্ত্ব", "Ì": "ত্থ", "Z¥": "ত্ম",
        "š—¡": "ন্ত্ব", "Z¡": "ত্ব", "Î": "ত্র", "_¡": "থ্ব", "˜M": "দ্গ", "˜N": "দ্ঘ",
        "Ï": "দ্দ", "ï": "শু", "×": "দ্ধ", "Ø": "দ্ব", "™¢": "দ্ভ", "Ù": "দ্ম",
        "`ª“": "দ্রু", "aŸ": "ধ্ব", "a¥": "ধ্ম", "›U": "ন্ট", "Ú": "ন্ঠ", "Û": "ন্ড",
        "šÍ": "ন্ত", "š—": "ন্ত", "š¿": "ন্ত্র", "š’": "ন্থ", "›`": "ন্দ", "›Ø": "ন্দ্ব",
        "Ü": "ন্ধ", "bœ": "ন্ন", "š^": "ন্ব", "b¥": "ন্ম", "Þ": "প্ট", "ß": "প্ত",
        "cœ": "প্ন", "à": "প্প", "cø": "প্ল", "kø": "শ্ল", "jø": "ল্ল", "c­": "প্ল",
        "á": "প্স", "d¬": "ফ্ল", "â": "ব্জ", "ã": "ব্দ", "ä": "ব্ধ", "eŸ": "ব্ব",
        "e­": "ব্ল", "å": "ভ্র", "gœ": "ম্ন", "¤ú": "ম্প", "ç": "ম্ফ", "¤^": "ম্ব",
        "¤¢": "ম্ভ", "¤£": "ম্ভ্র", "¤¬": "ম্ল", "j¨": "ক্য", "l¨": "দ্য", "i“": "রু",
        "iƒ": "রূ", "…": "ৃ", "†": "ে", "‡": "ে", "ë": "ল্ট", "ü": "হৃ",
        "ú": "ু", "û": "হু", "ˆ": "ৈ", "‰": "ৈ", "Š": "ৗ", "Œ": "ৌ",
        "•": "ঙ্", "œ": "ণ", "Ÿ": "্ব", "¡": "্ব", "¢": "্ভ", "£": "্ভ্র",
        "¥": "্ম", "¦": "্ব", "§": "্ম", "©": "র্", "ª": "্র", "«": "্র",
        "¬": "্ল", "­": "্ল", "Av": "আ", "B": "ই", "®‹": "ষ্ক", "Y¡": "ণ্ব",
        "C": "ঈ", "D": "উ", "E": "ঊ", "F": "ঋ", "G": "এ", "H": "ঐ",
        "I": "ও", "J": "ঔ", "K": "ক", "L": "খ", "M": "গ", "N": "ঘ",
        "O": "ঙ", "P": "চ", "Q": "ছ", "R": "জ", "S": "ঝ", "T": "ঞ",
        "U": "ট", "V": "ঠ", "W": "ড", "X": "ঢ", "Y": "ণ", "Z": "ত",
        "r": "ৎ", "_": "থ", "`": "দ", "a": "ধ", "b": "ন", "c": "প",
        "d": "ফ", "e": "ব", "f": "ভ", "g": "ম", "h": "য", "i": "র",
        "j": "ল", "k": "শ", "l": "ষ", "m": "স", "n": "হ", "o": "ড়",
        "p": "ঢ়", "q": "য়", "s": "ং", "t": "ঃ", "u": "ঁ", "w": "ি",
        "‚": "ূ", "x": "ী", "y": "ু", "z": "ু", "v": "া", "0": "০",
        "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬",
        "7": "৭", "8": "৮", "9": "৯", "&": "্", "‘": "‘", "’": "’",
        "“": "“", "”": "”", "ô": "ষ্ঠ", "μ": "ক্র", "é": "ল্ক", "^": "্ব",
        "Ð": "ণ্ড", " ̧": "গু", "ð": "শ্চ", "æ": "ু", "„": "ৃ", "mœ": "স্ন",
        " ̈": "্য", "A": "অ", "Ö": "্র", "ó": "ষ্ট", "~": "ূ", "j¦": "ল্ব",
        "ê": "ল্গ", "ì": "ল্ড", "¯ú": "স্প", " ̄ú": "স্প", "j¥": "ল্ম", "kœ": "শ্ন",
        "k¦": "শ্ব", "k¥": "শ্ম", "k­": "শ্ল", "®Œ": "ষ্ক্র", "ò": "ষ্ণ", "õ": "ষ্ফ",
        "®§": "ষ্ম", "ö": "স্খ", "¯¿": "স্ত্র", "̄¿": "স্ত্র", "ù": "স্ফ", "¯­": "স্ল",
        "þ": "হ্ম", "n¬": "হ্ল", "...": "ৃ", "¨": "্য", "˜¡": "দ্ব", "î": "ল্ফ",
        "¯Œ": "স্ক্র", " ̄Œ": "স্ক্র", "¯‹": "স্ক", " ̄‹": "স্ক", "¯‘": "স্তু", "̄‘": "স্তু",
        "¯’": "স্থ", " ̄’": "স্থ", "¯^": "স্ব", " ̄^": "স্ব", "¯§": "স্ম", "̄§": "স্ম",
        "¯ø": "স্ল", "̄ø": "স্ল", "¯Í": "স্ত", " ̄Í": "স্ত", "÷": "স্ট", " ̄^©": "র্স্ব",
        "í": "ল্প", "²": "ক্ষ্ম", "ý": "হ্ন", "nè": "হ্ণ", "¶œ": "ক্ষ্ন", "¶è": "ক্ষ্ণ",
        "¶¨©": "র্ক্ষ্য", "M¨©": "র্গ্য", "MÖ©": "র্গ্র", "N¨©": "র্ঘ্য", "½©": "র্ঙ্গ", "”Q©": "র্চ্ছ",
        "P¨©": "র্চ্য", "Á©": "র্জ্ঞ", "R¨©": "র্জ্য", "R¡©": "র্জ্ব", "X¨©": "র্ঢ্য", "Y¨©": "র্ণ্য",
        "Ë©": "র্ত্ত", "Z¥©": "র্ত্ম", "Z¨©": "র্ত্য", "Î©": "র্ত্র", "Z¡©": "র্ত্ব", "_¨©": "র্থ্য",
        "×©": "র্দ্ধ", "`¨©": "র্দ্য", "`ª©": "র্দ্র", "Ø©": "র্দ্ব", "aœ©": "র্ধ্ন", "a¥©": "র্ধ্ম",
        "a¨©": "র্ধ্য", "aª©": "র্ধ্র", "aŸ©": "র্ধ্ব", "b¨©": "র্ন্য", "eª©": "র্ব্র", "f¨©": "র্ভ্য",
        "å©": "র্ভ্র", "g¨©": "র্ম্য", "e¨©": "র্ব্য", "k¦©": "র্শ্ব", "ó©": "র্ষ্ট", "ò©": "র্ষ্ণ",
        "®§©": "র্ষ্ম", "l¨©": "র্ষ্য", "óª©": "র্ষ্ট্র", "¯^©": "র্স্ব", "n¨©": "র্হ্য", "nª©": "র্হ্র",
        "Ñ": "—", "Ô": "‘", "Õ": "’", "Ò": "“", "Ó": "”", "র্": "র্"
      };

      const isBanglaBanjonborno = (c) => c && "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়ৎংঃঁ".includes(c);
      const isBanglaPreKar = (c) => c && "িেৈ".includes(c);
      const isBanglaHalant = (c) => c === '্';

      const sortedKeys = Object.keys(bijoy_map).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedKey, 'g');
        processed = processed.replace(regex, bijoy_map[key]);
      }

      processed = processed.replace(/([ক-হড়ঢ়য়ংঃঁ])(র্)([ািীুূৃৄৢৣেৈোৌ]?)/g, '$2$1$3');

      let processedText = "";
      for (let i = 0; i < processed.length; i++) {
        if (isBanglaPreKar(processed[i]) && i + 1 < processed.length) {
          let clusterEnd = i + 1;
          while (clusterEnd < processed.length) {
            if (isBanglaBanjonborno(processed[clusterEnd]) && isBanglaHalant(processed[clusterEnd + 1])) {
              clusterEnd += 2;
            } else if (isBanglaBanjonborno(processed[clusterEnd])) {
              clusterEnd += 1;
              break;
            } else {
              break;
            }
          }
          const cluster = processed.substring(i + 1, clusterEnd);
          processedText += cluster + processed[i];
          i = clusterEnd - 1;
        } else {
          processedText += processed[i];
        }
      }
      return processedText.replace(/\u09C7\u09BE/g, '\u09CB').replace(/\u09C7\u09D7/g, '\u09CC');
    },

    unicodeToBijoy(text) {
      if (!text) return "";
      let str = String(text);

      const unicode_to_bijoy_map = {
        "র্ক্ষ্য": "¶¨©", "র্গ্য": "M¨©", "র্গ্র": "MÖ©", "র্ঘ্য": "N¨©", "র্ঙ্গ": "½©", "র্চ্ছ": "”Q©",
        "র্চ্য": "P¨©", "র্জ্ঞ": "Á©", "র্জ্য": "R¨©", "র্জ্ব": "R¡©", "র্ঢ্য": "X¨©", "র্ণ্য": "Y¨©",
        "র্ত্ত": "Ë©", "র্ত্ম": "Z¥©", "র্ত্য": "Z¨©", "র্ত্র": "Î©", "র্ত্ব": "Z¡©", "র্থ্য": "_¨©",
        "র্দ্ধ": "×©", "র্দ্য": "`¨©", "র্দ্র": "`ª©", "র্দ্ব": "Ø©", "র্ধ্ন": "aœ©", "র্ধ্ম": "a¥©",
        "র্ধ্য": "a¨©", "র্ধ্র": "aª©", "র্ধ্ব": "aŸ©", "র্ন্য": "b¨©", "র্ব্র": "eª©", "র্ভ্য": "f¨©",
        "র্ভ্র": "å©", "র্ম্য": "g¨©", "র্ব্য": "e¨©", "র্শ্ব": "k¦©", "র্ষ্ট": "ó©", "র্ষ্ণ": "ò©",
        "র্ষ্ম": "®§©", "র্ষ্য": "l¨©", "র্ষ্ট্র": "óª©", "র্স্ব": "¯^©", "র্হ্য": "n¨©", "র্হ্র": "nª©",

        "চ্ছ্ব": "”Q¡", "জ্জ্ব": "¾¡", "ভ্যু": "fz¨", "ন্ত্ব": "š—¡", "ত্ত্ব": "Ë¡",
        "দ্রু": "`ª“", "ম্ভ্র": "¤£", "ক্ষ্ম": "²", "ক্ষ্ন": "¶œ", "ক্ষ্ণ": "¶è",
        "স্ক্র": "¯Œ", "স্ক": "¯‹", "স্তু": "¯‘", "স্থ": "¯’", "স্ব": "¯^",
        "স্ম": "¯§", "স্ল": "¯ø", "স্ত": "¯Í", "স্ট": "÷", "স্ত্র": "¯¿",
        "স্প": "¯ú", "স্ফ": "ù", "স্খ": "ö", "স্ন": "mœ", "শ্ল": "kø",
        "শ্ম": "k¥", "শ্ব": "k¦", "শ্ন": "kœ", "শ্চ": "ð", "শু": "ï",
        "ষ্প": "®ú", "ষ্ক": "®‹", "ষ্ক্র": "®Œ", "ষ্ণ": "ò", "ষ্ফ": "õ",
        "ষ্ম": "®§", "ষ্ঠ": "ô", "ষ্ট": "ó", "হ্ম": "þ", "হ্ন": "ý",
        "হ্ণ": "nè", "হ্ল": "n¬", "হৃ": "ü", "হু": "û", "ল্ক": "é",
        "ল্গ": "ê", "ল্ট": "ë", "ল্ড": "ì", "ল্প": "í", "ল্ফ": "î",
        "ল্ল": "jø", "ল্ব": "j¦", "ল্ম": "j¥", "প্ল": "cø", "প্প": "à",
        "প্ন": "cœ", "প্ট": "Þ", "প্ত": "ß", "প্স": "á", "ফ্ল": "d¬",
        "ব্জ": "â", "ব্দ": "ã", "ব্ধ": "ä", "ব্ব": "eŸ", "ব্ল": "e­",
        "ভ্র": "å", "ম্ন": "gœ", "ম্প": "¤ú", "ম্ফ": "ç", "ম্ব": "¤^",
        "ম্ভ": "¤¢", "ম্ম": "¤§", "ম্ল": "¤¬", "ন্দ": "›`", "ন্দ্ব": "›Ø",
        "ন্ধ": "Ü", "ন্ন": "bœ", "ন্ব": "š^", "ন্ম": "b¥", "ন্ট": "›U",
        "ন্ঠ": "Ú", "ন্ড": "Û", "ন্ত": "šÍ", "ন্ত্র": "š¿", "ন্থ": "š’",
        "ন্স": "Ý", "দ্গ": "˜M", "দ্ঘ": "˜N", "দ্দ": "Ï", "দ্ধ": "×",
        "দ্ব": "Ø", "দ্ভ": "™¢", "দ্ম": "Ù", "ধ্ব": "aŸ", "ধ্ম": "a¥",
        "ত্ত": "Ë", "ত্থ": "Ì", "ত্ম": "Z¥", "ত্ব": "Z¡", "ত্র": "Î",
        "থ্ব": "_¡", "ট্ট": "Æ", "ট্ব": "U¡", "ট্ম": "U¥", "ড্ড": "Ç",
        "ণ্ট": "È", "ণ্ঠ": "É", "ণ্ড": "Ê", "ণ্ব": "Y^", "চ্চ": "”P",
        "চ্ছ": "”Q", "চ্ঞ": "”T", "জ্জ": "¾", "জ্ঝ": "À", "জ্ঞ": "Á",
        "জ্ব": "R¡", "ঞ্চ": "Â", "ঞ্ছ": "Ã", "ঞ্জ": "Ä", "ঞ্ঝ": "Å",
        "ঙ্ক": "¼", "ঙ্ক্ষ": "•¶", "ঙ্খ": "•L", "ঙ্গ": "½", "ঙ্ঘ": "•N",
        "ক্ক": "°", "ক্ট": "±", "ক্ত": "³", "ক্ব": "K¡", "ক্র": "µ",
        "ক্ল": "K¬", "ক্ষ": "¶", "ক্স": "·", "গু": "¸", "গ্ধ": "»",
        "গ্ন": "Mœ", "গ্ম": "M¥", "গ্ল": "M­", "গ্র": "MÖ", "প্র": "cÖ",
        "ফ্র": "d«", "ব্র": "eª", "শ্র": "kÖ", "হ্র": "nÖ", "দ্র": "`ª",
        "ধ্র": "aª", "ত্র": "Î", "র‌্য": "i¨", "্র্য": "ª¨", "ক্য": "K¨",
        "দ্য": "`¨", "রু": "i“", "রূ": "iƒ", "্যু": "¨y",

        "অ": "A", "আ": "Av", "ই": "B", "ঈ": "C", "উ": "D", "ঊ": "E",
        "ঋ": "F", "এ": "G", "ঐ": "H", "ও": "I", "ঔ": "J",

        "ক": "K", "খ": "L", "গ": "M", "ঘ": "N", "ঙ": "O", "চ": "P",
        "ছ": "Q", "জ": "R", "ঝ": "S", "ঞ": "T", "ট": "U", "ঠ": "V",
        "ড": "W", "ঢ": "X", "ণ": "Y", "ত": "Z", "থ": "_", "দ": "`",
        "ধ": "a", "ন": "b", "প": "c", "ফ": "d", "ব": "e", "ভ": "f",
        "ম": "g", "য": "h", "র": "i", "ল": "j", "শ": "k", "ষ": "l",
        "স": "m", "হ": "n", "ড়": "o", "ঢ়": "p", "য়": "q", "ৎ": "r",
        "ং": "s", "ঃ": "t", "ঁ": "u",

        "া": "v", "ি": "w", "ী": "x", "ু": "y", "ূ": "~", "ৃ": "…",
        "ে": "†", "ৈ": "ˆ", "ৌ": "Š", "্": "&", "্য": "¨", "্র": "ª",
        "্ব": "^", "্ম": "¥",

        "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5",
        "৬": "6", "৭": "7", "৮": "8", "৯": "9",

        "।": "|", "—": "Ñ", "‘": "‘", "’": "’", "“": "“", "”": "”"
      };

      str = str.replace(/\u09C7\u09BE/g, "\u09CB");
      str = str.replace(/\u09C7\u09D7/g, "\u09CC");

      str = str.replace(/র্([ক-হড়ঢ়য়](?:্[ক-হড়ঢ়য়])*(?:্[যর্বণন্ম])?)/g, '$1©');

      const clusterRegex = '([ক-হড়ঢ়য়](?:্[ক-হড়ঢ়য়])*(?:্[যর্বণন্ম])?©?)';

      str = str.replace(new RegExp(clusterRegex + '([ঁ]?)ো', 'g'), '†$1$2v');
      str = str.replace(new RegExp(clusterRegex + '([ঁ]?)ৌ', 'g'), '†$1$2Š');
      str = str.replace(new RegExp(clusterRegex + '([ঁ]?)ি', 'g'), 'w$1$2');
      str = str.replace(new RegExp(clusterRegex + '([ঁ]?)ে', 'g'), '†$1$2');
      str = str.replace(new RegExp(clusterRegex + '([ঁ]?)ৈ', 'g'), 'ˆ$1$2');

      const sortedKeys = Object.keys(unicode_to_bijoy_map).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        str = str.replace(new RegExp(escaped, 'g'), unicode_to_bijoy_map[key]);
      }

      return str;
    },

    convertBijoy(text, mode = "auto") {
      const raw = String(text || "");
      if (!raw) return "";
      if (mode === "ansi2uni" || mode === "bijoy2unicode" || mode === "unicode") {
        return this.bijoyToUnicode(raw);
      }
      if (mode === "uni2ansi" || mode === "unicode2bijoy" || mode === "ansi" || mode === "bijoy") {
        return this.unicodeToBijoy(raw);
      }
      if (/[\u0980-\u09FF]/.test(raw)) {
        return this.unicodeToBijoy(raw);
      }
      return this.bijoyToUnicode(raw);
    },

    diffText(text1Input, text2Input, options = {}) {
      const mode = options.mode || 'line';
      const ignoreCase = options.ignoreCase || false;
      const ignoreWhitespace = options.ignoreWhitespace || false;
      const raw1 = String(text1Input !== undefined && text1Input !== null ? text1Input : '');
      const raw2 = String(text2Input !== undefined && text2Input !== null ? text2Input : '');

      let aTokens = [];
      let bTokens = [];

      if (mode === 'word') {
        aTokens = raw1.match(/\s+|[^\s]+/g) || [];
        bTokens = raw2.match(/\s+|[^\s]+/g) || [];
      } else if (mode === 'char') {
        aTokens = Array.from(raw1);
        bTokens = Array.from(raw2);
      } else {
        aTokens = raw1.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
        bTokens = raw2.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      }

      function norm(str) {
        let s = String(str || '');
        if (ignoreCase) s = s.toLowerCase();
        if (ignoreWhitespace) s = s.replace(/\s+/g, ' ').trim();
        return s;
      }

      const n = aTokens.length;
      const m = bTokens.length;

      if (n === 0 && m === 0) {
        return {
          chunks: [],
          added: 0,
          removed: 0,
          unchanged: 0,
          identical: true,
          textReport: 'Texts are identical!\n',
          htmlReport: '<span class="c-accent ansi-bold">✓ Texts are identical! (0 differences)</span>'
        };
      }

      const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));

      for (let i = 1; i <= n; i++) {
        const ai = norm(aTokens[i - 1]);
        for (let j = 1; j <= m; j++) {
          if (ai === norm(bTokens[j - 1])) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }

      let i = n, j = m;
      const chunks = [];
      let addedCount = 0;
      let removedCount = 0;
      let unchangedCount = 0;

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && norm(aTokens[i - 1]) === norm(bTokens[j - 1])) {
          chunks.push({ type: 'unchanged', value: aTokens[i - 1], line1: i, line2: j });
          unchangedCount++;
          i--;
          j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          chunks.push({ type: 'added', value: bTokens[j - 1], line2: j });
          addedCount++;
          j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
          chunks.push({ type: 'removed', value: aTokens[i - 1], line1: i });
          removedCount++;
          i--;
        }
      }

      chunks.reverse();

      const identical = (addedCount === 0 && removedCount === 0);

      function esc(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      let textReport = '';
      if (identical) {
        textReport = '=== text diff report ===\nTexts are identical! (0 differences)\n';
      } else {
        textReport = `--- Text 1 (Original)\n+++ Text 2 (Modified)\n@@ -${n} lines, +${m} lines (diff: +${addedCount}, -${removedCount}) @@\n`;
        if (mode === 'line') {
          for (const chunk of chunks) {
            if (chunk.type === 'added') textReport += `+ ${chunk.value}\n`;
            else if (chunk.type === 'removed') textReport += `- ${chunk.value}\n`;
            else textReport += `  ${chunk.value}\n`;
          }
        } else {
          for (const chunk of chunks) {
            if (chunk.type === 'added') textReport += `[+${chunk.value}]`;
            else if (chunk.type === 'removed') textReport += `[-${chunk.value}]`;
            else textReport += chunk.value;
          }
          textReport += '\n';
        }
      }

      let htmlReport = '';
      if (identical) {
        htmlReport = '<span class="c-accent ansi-bold">✓ Texts are identical! (0 differences)</span>';
      } else {
        htmlReport += `<div class="c-dim" style="margin-bottom:6px;"><span class="c-accent ansi-bold">+${addedCount} added</span>, <span class="c-err ansi-bold">-${removedCount} removed</span>, <span class="c-file">${unchangedCount} unchanged</span></div>\n`;
        htmlReport += '<div class="diff-view" style="font-family:inherit; line-height:1.45;">';
        if (mode === 'line') {
          for (const chunk of chunks) {
            if (chunk.type === 'added') {
              htmlReport += `<div style="color:var(--accent-color); background:rgba(0,255,102,0.08); padding:1px 4px;"><span class="ansi-bold">+</span> ${esc(chunk.value)}</div>`;
            } else if (chunk.type === 'removed') {
              htmlReport += `<div style="color:var(--err-color); background:rgba(255,51,51,0.08); padding:1px 4px;"><span class="ansi-bold">-</span> ${esc(chunk.value)}</div>`;
            } else {
              htmlReport += `<div style="color:var(--dim-color); padding:1px 4px;">  ${esc(chunk.value)}</div>`;
            }
          }
        } else {
          for (const chunk of chunks) {
            if (chunk.type === 'added') {
              htmlReport += `<span style="color:var(--accent-color); background:rgba(0,255,102,0.18); font-weight:bold; padding:0 2px;">+${esc(chunk.value)}</span>`;
            } else if (chunk.type === 'removed') {
              htmlReport += `<span style="color:var(--err-color); background:rgba(255,51,51,0.18); text-decoration:line-through; padding:0 2px;">-${esc(chunk.value)}</span>`;
            } else {
              htmlReport += `<span style="color:var(--text-color);">${esc(chunk.value)}</span>`;
            }
          }
        }
        htmlReport += '</div>';
      }

      return {
        chunks,
        added: addedCount,
        removed: removedCount,
        unchanged: unchangedCount,
        identical,
        textReport: textReport.trim(),
        htmlReport
      };
    },

    /*---- QR Code Generator Engine ----*/
    getQrLib() {
      if (typeof window !== 'undefined' && window.qrcodegen) return window.qrcodegen;
      if (typeof globalThis !== 'undefined' && globalThis.qrcodegen) return globalThis.qrcodegen;
      if (typeof qrcodegen !== 'undefined') return qrcodegen;
      try {
        return require('./qrcodegen');
      } catch (e) {
        return null;
      }
    },

    parseQrEcc(eccStr) {
      const qrc = this.getQrLib();
      if (!qrc || !qrc.QrCode || !qrc.QrCode.Ecc) return null;
      if (!eccStr) return qrc.QrCode.Ecc.MEDIUM;
      if (typeof eccStr === 'object' && eccStr.ordinal !== undefined) return eccStr;
      const s = String(eccStr).toLowerCase().trim();
      if (s === 'low' || s === 'l' || s === '0' || s === '7%') return qrc.QrCode.Ecc.LOW;
      if (s === 'medium' || s === 'med' || s === 'm' || s === '1' || s === '15%') return qrc.QrCode.Ecc.MEDIUM;
      if (s === 'quartile' || s === 'quart' || s === 'q' || s === '2' || s === '25%') return qrc.QrCode.Ecc.QUARTILE;
      if (s === 'high' || s === 'h' || s === '3' || s === '30%') return qrc.QrCode.Ecc.HIGH;
      return qrc.QrCode.Ecc.MEDIUM;
    },

    generateQr(text, options = {}) {
      const qrc = this.getQrLib();
      if (!qrc || !qrc.QrCode) {
        return { error: 'QR Code library (qrcodegen) is not loaded.' };
      }
      try {
        const textStr = (text === undefined || text === null) ? '' : String(text);
        const ecc = this.parseQrEcc(options.ecc || 'medium');
        const minVer = Math.max(1, Math.min(40, parseInt(options.minVersion, 10) || 1));
        const maxVer = Math.max(minVer, Math.min(40, parseInt(options.maxVersion, 10) || 40));
        const mask = (options.mask !== undefined && options.mask !== null && options.mask !== '') ? parseInt(options.mask, 10) : -1;
        const boostEcc = options.boostEcc !== undefined ? Boolean(options.boostEcc) : true;

        let qr;
        if (options.isBinary && (Array.isArray(text) || text instanceof Uint8Array)) {
          qr = qrc.QrCode.encodeBinary(Array.from(text), ecc);
        } else {
          const segs = qrc.QrSegment.makeSegments(textStr);
          qr = qrc.QrCode.encodeSegments(segs, ecc, minVer, maxVer, mask, boostEcc);
        }

        const eccNames = ['Low (~7%)', 'Medium (~15%)', 'Quartile (~25%)', 'High (~30%)'];
        const eccName = eccNames[qr.errorCorrectionLevel.ordinal] || 'Unknown';

        return {
          qr,
          size: qr.size,
          version: qr.version,
          mask: qr.mask,
          ecc: qr.errorCorrectionLevel,
          eccName,
          text: textStr,
          isDark: (x, y) => qr.getModule(x, y)
        };
      } catch (err) {
        return { error: err.message || String(err) };
      }
    },

    generateQrAscii(qr, options = {}) {
      if (!qr) return '';
      const qrObj = qr.qr ? qr.qr : qr;
      if (!qrObj || typeof qrObj.getModule !== 'function') return '';
      const size = qrObj.size;
      const border = (options.border !== undefined) ? parseInt(options.border, 10) : 1;
      const mode = options.mode || 'half';
      const invert = Boolean(options.invert);

      if (mode === 'full') {
        const darkBlock = invert ? '  ' : '██';
        const lightBlock = invert ? '██' : '  ';
        let lines = [];
        for (let y = -border; y < size + border; y++) {
          let line = '';
          for (let x = -border; x < size + border; x++) {
            const isDark = (x >= 0 && x < size && y >= 0 && y < size) ? qrObj.getModule(x, y) : false;
            line += isDark ? darkBlock : lightBlock;
          }
          lines.push(line);
        }
        return lines.join('\n');
      }

      // Compact Half-block mode (2 vertical module rows per terminal line)
      let lines = [];
      for (let y = -border; y < size + border; y += 2) {
        let line = '';
        for (let x = -border; x < size + border; x++) {
          const topDark = (x >= 0 && x < size && y >= 0 && y < size) ? qrObj.getModule(x, y) : false;
          const y2 = y + 1;
          const btmDark = (x >= 0 && x < size && y2 >= 0 && y2 < size) ? qrObj.getModule(x, y2) : false;

          let top = invert ? !topDark : topDark;
          let btm = invert ? !btmDark : btmDark;

          if (top && btm) line += '█';
          else if (top && !btm) line += '▀';
          else if (!top && btm) line += '▄';
          else line += ' ';
        }
        lines.push(line);
      }
      return lines.join('\n');
    },

    generateQrSvg(qr, options = {}) {
      if (!qr) return '';
      const qrObj = qr.qr ? qr.qr : qr;
      if (!qrObj || typeof qrObj.getModule !== 'function') return '';
      const border = (options.border !== undefined && options.border >= 0) ? parseInt(options.border, 10) : 4;
      const lightColor = options.lightColor || '#FFFFFF';
      const darkColor = options.darkColor || '#000000';
      const fullSize = qrObj.size + border * 2;

      let pathD = '';
      for (let y = 0; y < qrObj.size; y++) {
        for (let x = 0; x < qrObj.size; x++) {
          if (qrObj.getModule(x, y)) {
            if (pathD.length > 0) pathD += ' ';
            pathD += `M${x + border},${y + border}h1v1h-1z`;
          }
        }
      }

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${fullSize} ${fullSize}" stroke="none">
  <rect width="100%" height="100%" fill="${lightColor}"/>
  <path d="${pathD}" fill="${darkColor}"/>
</svg>`;
    },

    generateQrCanvas(qr, options = {}, targetCanvas = null) {
      if (!qr) return null;
      const qrObj = qr.qr ? qr.qr : qr;
      if (!qrObj || typeof qrObj.getModule !== 'function') return null;
      const scale = Math.max(1, Math.min(50, parseInt(options.scale, 10) || 8));
      const border = Math.max(0, Math.min(50, (options.border !== undefined) ? parseInt(options.border, 10) : 4));
      const lightColor = options.lightColor || '#FFFFFF';
      const darkColor = options.darkColor || '#000000';

      const dim = (qrObj.size + border * 2) * scale;
      const canvas = targetCanvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
      if (!canvas) return null;

      canvas.width = dim;
      canvas.height = dim;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, dim, dim);
      ctx.fillStyle = darkColor;

      for (let y = 0; y < qrObj.size; y++) {
        for (let x = 0; x < qrObj.size; x++) {
          if (qrObj.getModule(x, y)) {
            ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
          }
        }
      }
      return canvas;
    },

    generateQrDataUrl(qr, options = {}) {
      const canvas = this.generateQrCanvas(qr, options);
      if (!canvas || !canvas.toDataURL) return '';
      return canvas.toDataURL('image/png');
    },

    /*---- bwip-js Engine (Data Matrix, Aztec, MaxiCode, PDF417) ----*/
    getBwipLib() {
      if (typeof window !== 'undefined' && window.bwipjs) return window.bwipjs;
      if (typeof globalThis !== 'undefined' && globalThis.bwipjs) return globalThis.bwipjs;
      try {
        return require('./bwipjs.min.js');
      } catch (e) {
        return null;
      }
    },

    normalize2DType(type) {
      if (!type) return 'qr';
      const clean = String(type).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean === 'qr' || clean === 'qrcode' || clean === 'qrcodegen') return 'qr';
      if (clean === 'datamatrix' || clean === 'dm') return 'datamatrix';
      if (clean === 'aztec' || clean === 'azteccode') return 'aztec';
      if (clean === 'maxicode' || clean === 'maxi') return 'maxicode';
      return clean;
    },

    generate2DCode(text, type = 'qr', options = {}) {
      const normType = this.normalize2DType(type);
      if (normType === 'qr') {
        const qrRes = this.generateQr(text, options);
        if (qrRes.error) return qrRes;
        qrRes.type = 'qr';
        qrRes.typeName = 'QR Code';
        return qrRes;
      }

      const bwip = this.getBwipLib();
      if (!bwip) {
        return { error: 'bwip-js library not loaded' };
      }

      const textStr = (text === undefined || text === null) ? '' : String(text);
      if (!textStr.trim()) {
        return { error: 'Payload text cannot be empty' };
      }

      try {
        const bcid = normType === 'aztec' ? 'azteccode' : normType;
        const bwipOpts = {};
        if (options.scale) bwipOpts.scale = Number(options.scale);
        if (options.padding != null) bwipOpts.padding = Number(options.padding);
        if (options.border != null) bwipOpts.padding = Number(options.border);
        if (normType === 'datamatrix') {
          if (options.shape === 'rect' || options.shape === 'rectangular') bwipOpts.rectangular = true;
          if (options.shape === 'square') bwipOpts.square = true;
          if (options.parsefnc) bwipOpts.parsefnc = true;
        } else if (normType === 'aztec') {
          if (options.format) bwipOpts.format = options.format;
          if (options.layers) bwipOpts.layers = parseInt(options.layers, 10);
          if (options.eclevel) bwipOpts.eclevel = parseInt(options.eclevel, 10);
        } else if (normType === 'maxicode') {
          if (options.mode) bwipOpts.mode = parseInt(options.mode, 10);
        }

        if (normType === 'maxicode') {
          const svg = bwip.toSVG({ bcid: 'maxicode', text: textStr, ...bwipOpts });
          return {
            type: 'maxicode',
            typeName: 'MaxiCode',
            text: textStr,
            svg: svg,
            mode: bwipOpts.mode || 4
          };
        }

        const rawList = bwip.raw(bcid, textStr, bwipOpts);
        if (!rawList || !rawList[0]) {
          return { error: `Failed to generate raw matrix for ${normType}` };
        }
        const raw = rawList[0];
        const width = raw.pixx;
        const height = raw.pixy;
        const pixs = raw.pixs;

        const typeNames = {
          datamatrix: 'Data Matrix',
          aztec: 'Aztec Code'
        };

        return {
          type: normType,
          typeName: typeNames[normType] || normType,
          text: textStr,
          size: Math.max(width, height),
          width,
          height,
          pixs,
          raw,
          options: bwipOpts,
          isDark: (x, y) => {
            if (x < 0 || x >= width || y < 0 || y >= height) return false;
            return pixs[y * width + x] === 1;
          }
        };
      } catch (err) {
        return { error: err && err.message ? err.message : String(err) };
      }
    },

    generate2DCodeAscii(res, options = {}) {
      if (!res || res.error) return `[2D Code Error: ${res ? res.error : 'Invalid code'}]`;
      if (res.type === 'qr' || res.qr) {
        return this.generateQrAscii(res, options);
      }

      if (res.type === 'maxicode') {
        const lines = [
          '  (●)  MaxiCode Symbology  (●)',
          'Mode: ' + (res.mode || 4) + ' | Payload: ' + res.text,
          '[Use SVG or Canvas view for MaxiCode hexagon rendering]'
        ];
        return lines.join('\n');
      }

      const width = res.width || res.size;
      const height = res.height || res.size;
      const border = (options.border !== undefined) ? parseInt(options.border, 10) : 1;
      const mode = options.mode || 'half';
      const invert = Boolean(options.invert);

      if (mode === 'full') {
        const darkBlock = invert ? '  ' : '██';
        const lightBlock = invert ? '██' : '  ';
        const lines = [];
        for (let y = -border; y < height + border; y++) {
          let line = '';
          for (let x = -border; x < width + border; x++) {
            line += res.isDark(x, y) ? darkBlock : lightBlock;
          }
          lines.push(line);
        }
        return lines.join('\n');
      }

      // Half-block unicode mode (▀, ▄, █, ' ')
      const fullWidth = width + border * 2;
      const fullHeight = height + border * 2;
      const lines = [];
      for (let y = 0; y < fullHeight; y += 2) {
        let line = '';
        for (let x = 0; x < fullWidth; x++) {
          const modX = x - border;
          const topDark = res.isDark(modX, y - border);
          const botDark = (y + 1 < fullHeight) ? res.isDark(modX, y + 1 - border) : false;
          const top = invert ? !topDark : topDark;
          const bottom = invert ? !botDark : botDark;
          if (top && bottom) line += '█';
          else if (top && !bottom) line += '▀';
          else if (!top && bottom) line += '▄';
          else line += ' ';
        }
        lines.push(line);
      }
      return lines.join('\n');
    },

    generate2DCodeSvg(text, type = 'qr', options = {}) {
      const normType = this.normalize2DType(type);
      if (normType === 'qr') {
        const res = this.generateQr(text, options);
        if (res.error) return `<svg xmlns="http://www.w3.org/2000/svg"><text fill="red">${res.error}</text></svg>`;
        return this.generateQrSvg(res, options);
      }

      const bwip = this.getBwipLib();
      if (!bwip) return `<svg xmlns="http://www.w3.org/2000/svg"><text>bwip-js not loaded</text></svg>`;

      try {
        const bcid = normType === 'aztec' ? 'azteccode' : normType;
        const bwipOpts = {
          scale: options.scale || 3,
          padding: options.border != null ? options.border : 2,
          backgroundcolor: (options.lightColor || options.background || 'ffffff').replace(/^#/, ''),
          barcolor: (options.darkColor || options.color || '000000').replace(/^#/, '')
        };
        if (normType === 'datamatrix') {
          if (options.shape === 'rect' || options.shape === 'rectangular') bwipOpts.rectangular = true;
          if (options.shape === 'square') bwipOpts.square = true;
          if (options.parsefnc) bwipOpts.parsefnc = true;
        } else if (normType === 'aztec') {
          if (options.format) bwipOpts.format = options.format;
          if (options.layers) bwipOpts.layers = parseInt(options.layers, 10);
          if (options.eclevel) bwipOpts.eclevel = parseInt(options.eclevel, 10);
        } else if (normType === 'maxicode') {
          if (options.mode) bwipOpts.mode = parseInt(options.mode, 10);
        }
        return bwip.toSVG({ bcid, text: String(text || ' '), ...bwipOpts });
      } catch (e) {
        return `<svg xmlns="http://www.w3.org/2000/svg"><text fill="red">${e.message || e}</text></svg>`;
      }
    },

    generate2DCodeCanvas(text, type = 'qr', options = {}, targetCanvas = null) {
      const normType = this.normalize2DType(type);
      if (normType === 'qr') {
        const res = this.generateQr(text, options);
        if (res.error) return null;
        return this.generateQrCanvas(res, options, targetCanvas);
      }

      const bwip = this.getBwipLib();
      if (!bwip) return null;
      let canvas = targetCanvas;
      if (!canvas && typeof document !== 'undefined' && document.createElement) {
        canvas = document.createElement('canvas');
      }
      if (!canvas) return null;

      try {
        const bcid = normType === 'aztec' ? 'azteccode' : normType;
        const bwipOpts = {
          scale: options.scale || 3,
          padding: options.border != null ? options.border : 2,
          backgroundcolor: (options.lightColor || options.background || 'ffffff').replace(/^#/, ''),
          barcolor: (options.darkColor || options.color || '000000').replace(/^#/, '')
        };
        if (normType === 'datamatrix') {
          if (options.shape === 'rect' || options.shape === 'rectangular') bwipOpts.rectangular = true;
          if (options.shape === 'square') bwipOpts.square = true;
          if (options.parsefnc) bwipOpts.parsefnc = true;
        } else if (normType === 'aztec') {
          if (options.format) bwipOpts.format = options.format;
          if (options.layers) bwipOpts.layers = parseInt(options.layers, 10);
          if (options.eclevel) bwipOpts.eclevel = parseInt(options.eclevel, 10);
        } else if (normType === 'maxicode') {
          if (options.mode) bwipOpts.mode = parseInt(options.mode, 10);
        }
        bwip.toCanvas(canvas, { bcid, text: String(text || ' '), ...bwipOpts });
        return canvas;
      } catch (e) {
        return null;
      }
    },

    generate2DCodeDataUrl(text, type = 'qr', options = {}) {
      const canvas = this.generate2DCodeCanvas(text, type, options);
      if (!canvas || !canvas.toDataURL) return '';
      return canvas.toDataURL('image/png');
    },

    getBarcodeLib() {
      if (typeof window !== 'undefined' && window.JsBarcode) return window.JsBarcode;
      if (typeof globalThis !== 'undefined' && globalThis.JsBarcode) return globalThis.JsBarcode;
      try {
        return require('./jsbarcode.min.js');
      } catch (e) {
        return null;
      }
    },

    normalizeBarcodeFormat(format) {
      if (!format) return 'CODE128';
      const clean = String(format).toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (clean === 'UPCA' || clean === 'UPC') return 'UPC';
      if (clean === 'UPCE') return 'UPCE';
      if (clean === 'EAN13' || clean === 'EAN') return 'EAN13';
      if (clean === 'EAN8') return 'EAN8';
      if (clean === 'EAN5') return 'EAN5';
      if (clean === 'EAN2') return 'EAN2';
      if (clean === 'CODE39') return 'CODE39';
      if (clean === 'CODE128') return 'CODE128';
      if (clean === 'CODE128A') return 'CODE128A';
      if (clean === 'CODE128B') return 'CODE128B';
      if (clean === 'CODE128C') return 'CODE128C';
      if (clean === 'ITF14') return 'ITF14';
      if (clean === 'ITF') return 'ITF';
      if (clean === 'MSI10') return 'MSI10';
      if (clean === 'MSI11') return 'MSI11';
      if (clean === 'MSI1010') return 'MSI1010';
      if (clean === 'MSI1110') return 'MSI1110';
      if (clean === 'MSI') return 'MSI';
      if (clean === 'PHARMACODE') return 'pharmacode';
      if (clean === 'CODABAR') return 'codabar';
      if (clean === 'CODE93' || clean === 'CODE93FULLASCII') return 'CODE93';
      if (clean === 'PDF417' || clean === 'COMPACTPDF417' || clean === 'PDF417TRUNC') return 'pdf417';
      if (clean === 'MICROPDF417') return 'micropdf417';
      return format;
    },

    generateBarcode(text, options = {}) {
      const format = this.normalizeBarcodeFormat(options.format || 'CODE128');

      if (typeof text !== 'string') text = String(text != null ? text : '');
      if (!text.trim()) {
        return { error: 'Barcode input cannot be empty' };
      }

      if (format === 'pdf417' || format === 'micropdf417') {
        const bwip = this.getBwipLib();
        if (!bwip) return { error: 'bwip-js library not loaded' };
        try {
          const bcid = format;
          const bwipOpts = {};
          if (options.columns) bwipOpts.columns = parseInt(options.columns, 10);
          if (options.rows) bwipOpts.rows = parseInt(options.rows, 10);
          if (options.eclevel !== undefined && options.eclevel !== null && options.eclevel !== '') bwipOpts.eclevel = parseInt(options.eclevel, 10);
          if (options.compact) bwipOpts.compact = true;
          const rawList = bwip.raw(bcid, text, bwipOpts);
          if (!rawList || !rawList[0]) return { error: `Failed to generate ${format}` };
          const raw = rawList[0];
          const width = raw.pixx;
          const height = raw.pixy;
          const pixs = raw.pixs;
          let totalBinary = '';
          for (let i = 0; i < pixs.length; i++) {
            totalBinary += pixs[i] ? '1' : '0';
          }
          return {
            text,
            format: format.toUpperCase(),
            is2dBarcode: true,
            width,
            height,
            pixs,
            raw,
            options: Object.assign({}, options, { format: format.toUpperCase() }),
            binary: totalBinary,
            totalModules: pixs.length,
            isDark: (x, y) => {
              if (x < 0 || x >= width || y < 0 || y >= height) return false;
              return pixs[y * width + x] === 1;
            }
          };
        } catch (e) {
          return { error: e.message || String(e) };
        }
      }

      const lib = this.getBarcodeLib();
      if (!lib) {
        return { error: 'JsBarcode library not loaded' };
      }

      const dataObj = {};
      const opts = Object.assign({
        format: format,
        width: options.width != null ? Number(options.width) : 2,
        height: options.height != null ? Number(options.height) : 100,
        displayValue: options.displayValue !== false,
        text: options.text,
        fontOptions: options.fontOptions || '',
        font: options.font || 'monospace',
        textAlign: options.textAlign || 'center',
        textPosition: options.textPosition || 'bottom',
        textMargin: options.textMargin != null ? Number(options.textMargin) : 2,
        fontSize: options.fontSize != null ? Number(options.fontSize) : 20,
        background: options.background || '#ffffff',
        lineColor: options.lineColor || '#000000',
        margin: options.margin != null ? Number(options.margin) : 10,
        flat: !!options.flat,
        ean128: !!options.ean128,
        mod43: !!options.mod43
      }, options);
      opts.format = format;

      try {
        lib(dataObj, text, opts);
        if (!dataObj.encodings || dataObj.encodings.length === 0) {
          return { error: `Failed to generate encodings for format ${format}` };
        }

        let totalBinary = '';
        for (const enc of dataObj.encodings) {
          if (enc && enc.data) totalBinary += enc.data;
        }

        return {
          text,
          format,
          options: opts,
          encodings: dataObj.encodings,
          binary: totalBinary,
          totalModules: totalBinary.length
        };
      } catch (err) {
        return { error: err && err.message ? err.message : String(err) };
      }
    },

    generateBarcodeAscii(barcodeResult, options = {}) {
      let res = barcodeResult;
      if (typeof barcodeResult === 'string') {
        res = this.generateBarcode(barcodeResult, options);
      }
      if (!res || res.error) {
        return `[Barcode Error: ${res ? res.error : 'Invalid barcode'}]`;
      }

      if (res.is2dBarcode) {
        const width = res.width;
        const height = res.height;
        const border = (options.margin !== undefined) ? Math.min(parseInt(options.margin, 10), 4) : 1;
        const fullWidth = width + border * 2;
        const fullHeight = height + border * 2;
        const lines = [];
        for (let y = 0; y < fullHeight; y += 2) {
          let line = '';
          for (let x = 0; x < fullWidth; x++) {
            const modX = x - border;
            const top = res.isDark(modX, y - border);
            const bot = (y + 1 < fullHeight) ? res.isDark(modX, y + 1 - border) : false;
            if (top && bot) line += '█';
            else if (top && !bot) line += '▀';
            else if (!top && bot) line += '▄';
            else line += ' ';
          }
          lines.push(line);
        }
        if (res.options.displayValue !== false && options.displayValue !== false) {
          lines.push('');
          lines.push('  ' + res.text);
        }
        return lines.join('\n');
      }

      const height = Math.max(2, Math.min(20, Number(options.height || 6)));
      const quietZone = Math.max(0, options.margin != null ? Number(options.margin) : 2);
      const quietSpaces = ' '.repeat(quietZone);
      const binary = res.binary;
      const barChar = options.barChar || '█';
      const spaceChar = ' ';

      let barLine = '';
      for (let i = 0; i < binary.length; i++) {
        barLine += binary[i] === '1' ? barChar : spaceChar;
      }

      const lines = [];
      for (let h = 0; h < height; h++) {
        lines.push(quietSpaces + barLine + quietSpaces);
      }

      if (res.options.displayValue !== false && options.displayValue !== false) {
        const rawText = res.options.text || res.text;
        const textStr = String(rawText);
        const totalWidth = barLine.length + (quietZone * 2);
        let paddedText = textStr;
        if (textStr.length < totalWidth) {
          const leftPad = Math.floor((totalWidth - textStr.length) / 2);
          paddedText = ' '.repeat(leftPad) + textStr;
        }
        if (res.options.textPosition === 'top') {
          lines.unshift(paddedText);
          lines.unshift('');
        } else {
          lines.push('');
          lines.push(paddedText);
        }
      }

      return lines.join('\n');
    },

    generateBarcodeSvg(text, options = {}) {
      const format = this.normalizeBarcodeFormat(options.format || 'CODE128');

      if (format === 'pdf417' || format === 'micropdf417') {
        const bwip = this.getBwipLib();
        if (bwip) {
          try {
            const bwipOpts = {
              scale: options.width || 2,
              height: options.height ? Math.round(options.height / 8) : 10,
              padding: options.margin != null ? options.margin : 10,
              backgroundcolor: (options.background || 'ffffff').replace(/^#/, ''),
              barcolor: (options.lineColor || '000000').replace(/^#/, '')
            };
            if (options.columns) bwipOpts.columns = parseInt(options.columns, 10);
            if (options.rows) bwipOpts.rows = parseInt(options.rows, 10);
            if (options.eclevel !== undefined && options.eclevel !== null && options.eclevel !== '') bwipOpts.eclevel = parseInt(options.eclevel, 10);
            if (options.compact) bwipOpts.compact = true;
            return bwip.toSVG({
              bcid: format,
              text: String(text || ' '),
              ...bwipOpts
            });
          } catch (e) {
            return `<svg xmlns="http://www.w3.org/2000/svg"><text fill="red">${e.message || e}</text></svg>`;
          }
        }
      }

      const lib = this.getBarcodeLib();
      if (!lib) return `<svg xmlns="http://www.w3.org/2000/svg"><text>JsBarcode not loaded</text></svg>`;

      if (typeof document !== 'undefined' && document.createElementNS) {
        try {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const opts = Object.assign({}, options, { format });
          lib(svg, text, opts);
          return svg.outerHTML || new XMLSerializer().serializeToString(svg);
        } catch (e) {
          // Fall through to pure data fallback
        }
      }

      const res = this.generateBarcode(text, options);
      if (res.error) return `<svg xmlns="http://www.w3.org/2000/svg"><text fill="red">${res.error}</text></svg>`;

      const width = options.width || 2;
      const height = options.height || 100;
      const margin = options.margin != null ? options.margin : 10;
      const background = options.background || '#ffffff';
      const lineColor = options.lineColor || '#000000';
      const binary = res.binary;
      const svgWidth = (binary.length * width) + (margin * 2);
      const svgHeight = height + (margin * 2) + (options.displayValue !== false ? 25 : 0);

      let rects = '';
      for (let i = 0; i < binary.length; i++) {
        if (binary[i] === '1') {
          const x = margin + (i * width);
          rects += `<rect x="${x}" y="${margin}" width="${width}" height="${height}" fill="${lineColor}" />`;
        }
      }

      let textTag = '';
      if (options.displayValue !== false) {
        const textY = margin + height + 18;
        const textX = svgWidth / 2;
        textTag = `<text x="${textX}" y="${textY}" font-family="monospace" font-size="16" text-anchor="middle" fill="${lineColor}">${res.text}</text>`;
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}"><rect width="${svgWidth}" height="${svgHeight}" fill="${background}" /><g>${rects}</g>${textTag}</svg>`;
    },

    generateBarcodeCanvas(text, options = {}, targetCanvas = null) {
      const format = this.normalizeBarcodeFormat(options.format || 'CODE128');

      let canvas = targetCanvas;
      if (!canvas && typeof document !== 'undefined' && document.createElement) {
        canvas = document.createElement('canvas');
      }
      if (!canvas) return null;

      if (format === 'pdf417' || format === 'micropdf417') {
        const bwip = this.getBwipLib();
        if (bwip) {
          try {
            const bwipOpts = {
              scale: options.width || 2,
              height: options.height ? Math.round(options.height / 8) : 10,
              padding: options.margin != null ? options.margin : 10,
              backgroundcolor: (options.background || 'ffffff').replace(/^#/, ''),
              barcolor: (options.lineColor || '000000').replace(/^#/, '')
            };
            if (options.columns) bwipOpts.columns = parseInt(options.columns, 10);
            if (options.rows) bwipOpts.rows = parseInt(options.rows, 10);
            if (options.eclevel !== undefined && options.eclevel !== null && options.eclevel !== '') bwipOpts.eclevel = parseInt(options.eclevel, 10);
            if (options.compact) bwipOpts.compact = true;
            bwip.toCanvas(canvas, {
              bcid: format,
              text: String(text || ' '),
              ...bwipOpts
            });
            return canvas;
          } catch (e) {
            return null;
          }
        }
      }

      const lib = this.getBarcodeLib();
      if (!lib) return null;

      try {
        const opts = Object.assign({}, options, { format });
        lib(canvas, text, opts);
        return canvas;
      } catch (e) {
        return null;
      }
    },

    generateBarcodeDataUrl(text, options = {}) {
      const canvas = this.generateBarcodeCanvas(text, options);
      if (!canvas || !canvas.toDataURL) return '';
      return canvas.toDataURL('image/png');
    },

    symbologyRestrictions: {
      qr: {
        id: 'qr',
        name: 'QR Code (Quick Response Matrix)',
        type: '2D Matrix',
        allowedChars: 'all characters (UTF-8, Latin-1, binary bytes, numeric 0-9, alphanumeric A-Z 0-9 space $%*+-./:, kanji)',
        lengthLimit: 'up to 7,089 numeric, 4,296 alphanumeric, or 2,953 binary bytes (versions 1 to 40)',
        notes: 'supports 4 error correction levels (low ~7%, medium ~15%, quartile ~25%, high ~30%) and 8 mask patterns.',
        example: 'https://syzarn.github.io'
      },
      datamatrix: {
        id: 'datamatrix',
        name: 'Data Matrix (ISO/IEC 16022)',
        type: '2D Matrix',
        allowedChars: 'full ASCII (0-127), extended ASCII (128-255), UTF-8, and raw binary bytes',
        lengthLimit: 'up to 3,116 numeric, 2,335 alphanumeric, or 1,555 binary bytes (10x10 to 144x144)',
        notes: 'supports square and rectangular shapes. supports GS1/FNC1 parsing with --parsefnc.',
        example: 'DATA-MATRIX-SAMPLE-2026'
      },
      aztec: {
        id: 'aztec',
        name: 'Aztec Code (ISO/IEC 24778)',
        type: '2D Matrix',
        allowedChars: 'full 8-bit ASCII / binary data (all 256 byte values) and UTF-8',
        lengthLimit: 'compact: 1-4 layers (up to 89 numeric / 53 bytes); full-range: 1-32 layers (up to 3,832 numeric / 1,914 bytes)',
        notes: 'central square bullseye finder. adjustable Reed-Solomon ECC from 5% to 95% (default 23%). does not require a quiet zone.',
        example: 'AZTEC-CODE-PAYLOAD'
      },
      maxicode: {
        id: 'maxicode',
        name: 'MaxiCode (UPS / ISO/IEC 16023)',
        type: '2D Matrix',
        allowedChars: 'Mode 4 (standard) & Mode 5 (secure): full ASCII text/data. Mode 2 (US SCM) & Mode 3 (Intl SCM): structured carrier message (postal code, 3-digit country, 3-digit class of service)',
        lengthLimit: 'Mode 4: max 93 alphanumeric chars. Mode 5: max 77 alphanumeric chars (enhanced ECC)',
        notes: 'fixed-size honeycomb matrix of 884 hexagons in 33 rows with central concentric bullseye finder.',
        example: 'STANDARD-MAXICODE-PAYLOAD'
      },

      CODE128: {
        id: 'CODE128',
        name: 'Code 128 (Auto-switching A/B/C)',
        type: '1D Linear',
        allowedChars: 'full 128 standard ASCII character set (ASCII 0-127: letters, numbers, symbols, control chars)',
        lengthLimit: 'variable',
        notes: 'automatically switches between subsets A, B, and C for optimal density. includes modulo-103 checksum.',
        example: 'CODE128-Payload-2026'
      },
      CODE128A: {
        id: 'CODE128A',
        name: 'Code 128 Subset A',
        type: '1D Linear',
        allowedChars: 'uppercase letters (A-Z), digits (0-9), punctuation (ASCII 32-95), and control characters (0-31, NUL to US). no lowercase letters',
        lengthLimit: 'variable',
        notes: 'used when control codes (e.g. CR, LF, TAB) or uppercase alphanumeric characters are needed.',
        example: 'UPPERCASE-ONLY-128A'
      },
      CODE128B: {
        id: 'CODE128B',
        name: 'Code 128 Subset B',
        type: '1D Linear',
        allowedChars: 'standard printable ASCII characters (ASCII 32-127): uppercase (A-Z), lowercase (a-z), digits (0-9), and punctuation',
        lengthLimit: 'variable',
        notes: 'standard format for general-purpose mixed-case alphanumeric text and barcodes.',
        example: 'MixedCaseText-128B'
      },
      CODE128C: {
        id: 'CODE128C',
        name: 'Code 128 Subset C',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9).',
        lengthLimit: 'variable even number of digits [2n] (encoded in pairs 00-99)',
        notes: 'encodes 2 numeric digits per symbol character for ultra-high density.',
        example: '123456789012'
      },
      EAN13: {
        id: 'EAN13',
        name: 'EAN-13 (International Article Number)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9). must be exactly 12 or 13 digits',
        lengthLimit: 'exactly 12 digits (auto-appends 13th checksum) or 13 digits (with valid mod-10 checksum)',
        notes: 'worldwide retail standard barcode.',
        example: '978020137962'
      },
      EAN8: {
        id: 'EAN8',
        name: 'EAN-8 (Compact European Article Number)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9). must be exactly 7 or 8 digits',
        lengthLimit: 'exactly 7 digits (auto-appends 8th checksum) or 8 digits (with valid mod-10 checksum)',
        notes: 'compact retail barcode for small product packages.',
        example: '12345670'
      },
      UPC: {
        id: 'UPC',
        name: 'UPC-A (Universal Product Code)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9). must be exactly 11 or 12 digits',
        lengthLimit: 'exactly 11 digits (auto-appends 12th checksum) or 12 digits (with valid mod-10 checksum)',
        notes: 'standard retail product barcode widely used in north america.',
        example: '123456789012'
      },
      UPCE: {
        id: 'UPCE',
        name: 'UPC-E (Zero-Suppressed UPC)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9). 6, 7, or 8 digits (or compressible 11/12-digit UPC-A)',
        lengthLimit: '6, 7, or 8 digits',
        notes: 'zero-compressed version of UPC-A for small packages in US retail.',
        example: '01234565'
      },
      CODE39: {
        id: 'CODE39',
        name: 'Code 39 (Alpha39 / USD-2)',
        type: '1D Linear',
        allowedChars: 'uppercase letters (A-Z), numeric digits (0-9), space, and symbols: - . $ / + %',
        lengthLimit: 'variable (recommended <30 chars for scan reliability)',
        notes: 'lowercase letters are automatically capitalized. start/stop asterisk (*) delimiters are handled automatically.',
        example: 'CODE-39-TEST'
      },
      CODE93: {
        id: 'CODE93',
        name: 'Code 93 (High-Density Alpha)',
        type: '1D Linear',
        allowedChars: 'uppercase letters (A-Z), numeric digits (0-9), space, and symbols: - . $ / + % (Full ASCII via escapes)',
        lengthLimit: 'variable',
        notes: 'higher density than Code 39 with dual-check characters (C & K) for enhanced data security.',
        example: 'CODE93-DATA'
      },
      ITF14: {
        id: 'ITF14',
        name: 'ITF-14 (Packaging / Master Carton)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9). must be exactly 13 or 14 digits',
        lengthLimit: 'exactly 13 digits (auto-appends 14th checksum) or 14 digits',
        notes: 'used on outer shipping cartons and corrugated cardboard boxes for Master/Carton packaging.',
        example: '12345678901231'
      },
      ITF: {
        id: 'ITF',
        name: 'Interleaved 2 of 5 (ITF / I25)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9).',
        lengthLimit: 'variable even number of digits [2n]',
        notes: 'encodes pairs of digits simultaneously (bars encode one, spaces encode the other). odd count requires a leading zero.',
        example: '12345678'
      },
      pharmacode: {
        id: 'pharmacode',
        name: 'Pharmacode (Pharmaceutical Binary Code)',
        type: '1D Linear',
        allowedChars: 'numeric integer digits (0-9)',
        lengthLimit: 'single integer value from 3 to 131070',
        notes: 'single-track binary barcode used in pharmaceutical packaging inspection.',
        example: '12345'
      },
      codabar: {
        id: 'codabar',
        name: 'Codabar (NW-7 / Ames Code)',
        type: '1D Linear',
        allowedChars: 'numeric digits (0-9), symbols (- $ : / . +), with start and stop characters (A, B, C, D, T, N, *, or E)',
        lengthLimit: 'variable',
        notes: 'commonly used in blood banks, libraries, photo labs, and airbills. must start and end with valid delimiters.',
        example: 'A123456789B'
      },
      MSI: {
        id: 'MSI',
        name: 'MSI Plessey',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9)',
        lengthLimit: 'variable',
        notes: 'continuous symbology primarily used for supermarket warehouse shelves and retail inventory.',
        example: '1234567'
      },
      MSI10: {
        id: 'MSI10',
        name: 'MSI Plessey (Mod 10 Check Digit)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9)',
        lengthLimit: 'variable',
        notes: 'MSI Plessey barcode with automatically computed mod-10 check digit.',
        example: '1234567'
      },
      MSI11: {
        id: 'MSI11',
        name: 'MSI Plessey (Mod 11 Check Digit)',
        type: '1D Linear',
        allowedChars: 'numeric digits only (0-9)',
        lengthLimit: 'variable',
        notes: 'MSI Plessey barcode with automatically computed mod-11 check digit.',
        example: '1234567'
      },
      pdf417: {
        id: 'pdf417',
        name: 'PDF417 (Portable Data File 417)',
        type: 'Stacked 2D Barcode',
        allowedChars: 'full ASCII (0-127), text, numbers, and raw binary bytes (0-255)',
        lengthLimit: 'up to ~1,850 text characters, 2,710 numeric digits, or 1,108 binary bytes (1-30 columns, 3-90 rows)',
        notes: 'stacked linear 2D barcode widely used on ID cards, driver licenses, boarding passes, and shipping labels.',
        example: 'PDF417-PAYLOAD-2026'
      },
      compactpdf417: {
        id: 'compactpdf417',
        name: 'Compact PDF417 (Truncated PDF417)',
        type: 'Stacked 2D Barcode',
        allowedChars: 'full ASCII, text, numbers, and raw binary bytes (same as PDF417)',
        lengthLimit: 'up to ~1,850 text characters or 1,108 binary bytes (1-30 columns, 3-90 rows)',
        notes: 'truncated right-side stop pattern to conserve horizontal space in clean scanning environments.',
        example: 'COMPACT-PDF417-DATA'
      }
    },

    getSymbologyRestriction(formatOrType) {
      if (!formatOrType) return this.symbologyRestrictions.CODE128;
      const key = String(formatOrType).toLowerCase();
      if (key === 'qr' || key === 'qrcode' || key === 'qrcodegen') return this.symbologyRestrictions.qr;
      if (key === 'datamatrix' || key === 'dm') return this.symbologyRestrictions.datamatrix;
      if (key === 'aztec' || key === 'azteccode') return this.symbologyRestrictions.aztec;
      if (key === 'maxicode' || key === 'maxi') return this.symbologyRestrictions.maxicode;
      if (key === 'pdf417') return this.symbologyRestrictions.pdf417;
      if (key === 'compactpdf417' || key === 'micropdf417') return this.symbologyRestrictions.compactpdf417;

      const norm = this.normalizeBarcodeFormat(formatOrType);
      return this.symbologyRestrictions[norm] || this.symbologyRestrictions[formatOrType] || {
        id: formatOrType,
        name: formatOrType,
        type: 'Barcode',
        allowedChars: 'standard barcode payload',
        lengthLimit: 'variable',
        notes: 'ensure input matches symbology specification.',
        example: 'SAMPLE-128'
      };
    },

    toolsCatalog: [
      { id: "count", name: "count characters words sentences lines", category: "basic tools", desc: "analyze character, word, sentence, line and byte statistics with word frequency.", cli: "count [-c|-w|-s|-l|--freq] [file/text]" },
      { id: "replace", name: "find and replace", category: "basic tools", desc: "find and replace text using literal strings or regular expressions.", cli: "replace [-i|-g|-r] <search> <replace> [file/text]" },
      { id: "case", name: "letter case converter", category: "basic tools", desc: "convert text to uppercase, lowercase, titlecase, sentence case, random, camelCase, snake_case, etc.", cli: "case <upper|lower|title|sentence|random|camel|snake|kebab> [file/text]" },
      { id: "unaccent", name: "remove letter accents", category: "basic tools", desc: "strip diacritics and convert accented characters to their basic latin equivalents.", cli: "unaccent [file/text]" },
      { id: "trim", name: "remove unwanted spaces", category: "basic tools", desc: "trim leading/trailing whitespaces, collapse duplicate spaces, or remove all spaces.", cli: "trim [--all|--trim|--collapse] [file/text]" },
      { id: "prefix", name: "add prefix and/or suffix into each line", category: "line tools", desc: "insert custom prefix or suffix strings to every line.", cli: "prefix <prefix> [file/text] or suffix <suffix> [file/text]" },
      { id: "wrap", name: "add or remove line breaks", category: "line tools", desc: "remove line breaks, add breaks before/after occurrences, or wrap text at N characters.", cli: "wrap [--remove|--width N|--word] [file/text]" },
      { id: "join", name: "join lines", category: "line tools", desc: "join multiple lines with a delimiter or merge multi-column lists side-by-side.", cli: "join [-d delim] [file/text]" },
      { id: "uniq", name: "remove duplicate lines", category: "line tools", desc: "deduplicate lines with optional case sensitivity and empty line handling.", cli: "uniq [-i|-e] [file/text]" },
      { id: "compact", name: "remove empty lines", category: "line tools", desc: "remove blank and whitespace-only lines from text.", cli: "compact [file/text]" },
      { id: "filter", name: "remove lines containing", category: "line tools", desc: "filter lines matching or not matching patterns/regex with AND/OR conditions.", cli: "filter [-v] [-i] [-E] <pattern> [file/text]" },
      { id: "sort", name: "sort lines", category: "line tools", desc: "sort lines alphabetically, naturally (numeric), by length, randomly, or by delimited column.", cli: "sort [-n|-r|-l|-R|-i|-k N -d delim] [file/text]" },
      { id: "seq", name: "generate list of numbers", category: "numeration", desc: "generate sequential numbers with custom step, zero-padding, prefix, suffix, and delimiter.", cli: "seq <start> <end> [step] [--pad] [-p prefix] [-s suffix]" },
      { id: "nl", name: "number each line", category: "numeration", desc: "add line numbers to the left or right with custom padding, prefix, and suffix.", cli: "nl [-w width] [-p prefix] [-s suffix] [-r] [file/text]" },
      { id: "binary", name: "binary code converter", category: "obfuscation", desc: "convert standard text to 8-bit binary representation and binary back to text.", cli: "binary [-e|-d] [file/text]" },
      { id: "disemvowel", name: "disemvowel & revowel", category: "obfuscation", desc: "remove vowels or custom letters from text, or reconstruct words from a dictionary.", cli: "disemvowel [-v vowels] [file/text]" },
      { id: "encrypt", name: "encrypt / decrypt (tea cipher)", category: "obfuscation", desc: "encrypt and decrypt text with password using tiny encryption algorithm (tea) and base64.", cli: "encrypt -p <password> [text] / decrypt -p <password> [ciphertext]" },
      { id: "rev", name: "reverse flip upsidedown", category: "obfuscation", desc: "reverse full text, reverse words, reverse letters within words, flip mirror, or flip upside down.", cli: "rev [--words|--letters|--flip|--upsidedown] [file/text]" },
      { id: "rot13", name: "rot13 caesar cipher", category: "obfuscation", desc: "apply rot13 or arbitrary shift caesar cipher to text.", cli: "rot13 [-n shift] [file/text]" },
      { id: "scramble", name: "scramble / descramble words", category: "obfuscation", desc: "scramble internal letters of each word or descramble using english dictionary.", cli: "scramble [file/text] / descramble [file/text]" },
      { id: "comb", name: "combination generator", category: "permutation", desc: "generate mathematical combinations of objects of size K with or without repetition.", cli: "comb -k <size> [--repeat] [-d delim] [items...]" },
      { id: "perm", name: "permutation generator", category: "permutation", desc: "generate all mathematical permutations of input items.", cli: "perm [-d delim] [items...]" },
      { id: "rng", name: "random number generator", category: "randomization", desc: "generate n random integers in a specified min-max range with padding and custom delimiters.", cli: "rng [-n count] [-min low] [-max high] [--pad]" },
      { id: "randstr", name: "random string generator", category: "randomization", desc: "generate n random strings of length L from custom character sets.", cli: "randstr [-n count] [-l length] [-c charset]" },
      { id: "shuffle", name: "string randomizer", category: "randomization", desc: "randomly shuffle characters or delimited words/items.", cli: "shuffle [-d delim] [file/text]" },
      { id: "cut", name: "extract delimited column", category: "miscellaneous", desc: "extract nth column from delimited lines (csv, tsv, custom separator).", cli: "cut -d <delim> -f <col_number> [file/text]" },
      { id: "unicode", name: "unicode converter", category: "miscellaneous", desc: "convert text to HTML decimal, HTML hex, UTF-16, C-source escape or codepoints.", cli: "unicode [-f html_dec|html_hex|utf16_hex|c_source|codepoint] [file/text]" },
      { id: "diff", name: "text difference checker (diff)", category: "developer & data", desc: "compare two texts, code snippets, or files line-by-line or word-by-word with unified diff output.", cli: "diff [-w|-i|-W|--word|--char] <file1/text1> <file2/text2>" },
      { id: "mapdiff", name: "json map difference checker", category: "developer & data", desc: "compare two JSON objects or key-value maps to find missing, extra, and mismatched keys/values.", cli: "mapdiff <file1/json1> <file2/json2>" },
      { id: "bijoy", name: "bijoy (ANSI) ⇄ unicode converter", category: "linguistics & encoding", desc: "convert Bengali text between Bijoy (ANSI) encoding and standard Unicode (mjcdi engine).", cli: "bijoy [-a|-u] [file/text] or ansi2uni / uni2ansi" },
      { id: "url", name: "url encode / decode (percent-encoding)", category: "encoding & web", desc: "encode text into percent-encoded URL component (%xx format) or decode back.", cli: "urlencode [text] / urldecode [text]" },
      { id: "base64", name: "base64 encoder & decoder", category: "encoding & web", desc: "encode text into standard base64 string format or decode base64 strings.", cli: "base64 [-d] [file/text]" },
      { id: "iconv", name: "character encoding converter & detector", category: "encoding & web", desc: "detect and convert character encodings between UTF-8, Shift_JIS, EUC-JP, ISO-2022-JP, UTF-16.", cli: "iconv -t <to_enc> [-f <from_enc>] [file/text] / detect-encoding [file/text]" },
      { id: "zenkaku", name: "japanese zenkaku / hankaku & kana", category: "encoding & web", desc: "convert full-width (zenkaku) / half-width (hankaku) and Hiragana / Katakana.", cli: "zenkaku [text] / hankaku [text] / kana <hiragana|katakana|hankana|zenkana> [text]" },
      { id: "punycode", name: "punycode & IDN", category: "encoding & web", desc: "encode or decode unicode domain names and strings to ASCII punycode (RFC 3492/5891) and back.", cli: "punycode <encode|decode|to-ascii|to-unicode> [file/text] / idn <encode|decode> [domain]" },
      { id: "qrcode", name: "2D matrix generator", category: "encoding & web", desc: "generate 2D matrix codes (QR code, data matrix, aztec code, maxicode) with ASCII art, SVG, and PNG canvas.", cli: "qrcode [-t qr|datamatrix|aztec|maxicode] [-f ascii|svg|png] [file/text]" },
      { id: "barcode", name: "1D & stacked barcode generator", category: "encoding & web", desc: "generate 1D and stacked 2D barcodes (CODE128, EAN-13, UPC, CODE39, ITF, PDF417, codabar, pharmacode, MSI, CODE93) with ASCII, SVG, and PNG export.", cli: "barcode [-f format] [-w width] [-h height] [--no-text] [--color hex] [file/text]" }
    ]
  };

  return TextEngine;
});

