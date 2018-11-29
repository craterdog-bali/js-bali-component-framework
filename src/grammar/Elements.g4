grammar Elements;
import Tokens;

element:
    angle |
    binary |
    duration |
    filter |
    moment |
    number |
    percent |
    probability |
    reference |
    reserved |
    symbol |
    tag |
    text |
    version
;

angle: '~' real;

binary: BINARY;

duration: DURATION;

filter:
    'none'  #noneFilter |
    'any'   #anyFilter |
    REGEX   #expressionFilter
;

imaginary: IMAGINARY;

moment: MOMENT;

number:
    'undefined'                               #undefinedNumber |
    'infinity'                                #infiniteNumber  |
    real                                      #realNumber      |
    imaginary                                 #imaginaryNumber |
    '(' real del=(',' | 'e^~') imaginary ')'  #complexNumber
;

percent: real '%';

probability:
    'false'   #falseProbability      |
    FRACTION  #fractionalProbability |
    'true'    #trueProbability
;

real: '0' | REAL;

reference: RESOURCE;

reserved: RESERVED;

symbol: SYMBOL;

tag: TAG;

text:
    TEXT        #inlineText |
    TEXT_BLOCK  #newlineText
;

version: VERSION;
