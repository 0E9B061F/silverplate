'use strict';

// word length
// sentence length
// total length

var ROOTTEXTS = 0;
var SUBTEXTS = 0;
var LONGWORD = 9;
var VERYLONGWORD = 12;
var LONGSENTENCE = 150;
var VERYLONGSENTENCE = 225;
var LONGPARAGRAPH = 700;
var VERYLONGPARAGRAPH = 850;

const TESTDATA = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus purus sapien, condimentum eu fermentum at, auctor ac sem. Cras egestas venenatis purus at commodo. Morbi venenatis auctor nibh nec mattis. Mauris feugiat quam metus, a egestas quam molestie vitae. Curabitur erat arcu, tempus iaculis augue nec, posuere ultricies eros. Mauris eu aliquet lacus. Phasellus sed malesuada lacus. Proin ullamcorper ligula ut elit ultrices, gravida consequat dui semper.

Praesent aliquam felis tortor, quis bibendum augue blandit ut. Integer convallis justo aliquet, tempus mauris vitae, lobortis purus. In leo quam, congue eget velit vitae, vestibulum tempus nulla. Mauris maximus nulla ac dui dapibus tempor. Mauris aliquet maximus quam, sed gravida neque egestas quis. Aenean sit amet molestie lacus, vel volutpat arcu. Quisque fringilla tincidunt arcu. Integer vulputate justo sed gravida faucibus. Duis viverra, risus in laoreet aliquam, neque felis pharetra elit, a suscipit velit urna vel erat. Suspendisse sed mi in sapien vestibulum ullamcorper nec quis orci. Pellentesque aliquam urna nec mi tempor, at consequat lacus efficitur. Curabitur sit amet augue varius, dignissim nibh eu, dictum magna. Proin vestibulum ut lacus eu rhoncus. Curabitur facilisis sed mauris ac consectetur.

Donec fermentum velit in magna malesuada iaculis. Vivamus porttitor sapien ut elit venenatis ultricies. Vestibulum quis maximus neque. Vivamus pharetra leo neque. Vivamus elementum, mauris eget posuere scelerisque, magna enim rhoncus dolor, ac malesuada nisi purus at arcu. Ut tempor libero leo, id condimentum ex accumsan ac. In et diam vitae dui placerat imperdiet nec id turpis. Quisque varius quis elit at molestie. Donec non faucibus augue, venenatis fermentum dolor. Vivamus varius posuere odio eget commodo. Integer hendrerit, massa quis maximus condimentum, lacus arcu eleifend turpis, at iaculis lorem tellus ac augue. Maecenas dapibus velit id eleifend tincidunt. Quisque feugiat malesuada metus non mattis. Nulla facilisi.

Pellentesque porttitor vel dolor et tincidunt. Mauris maximus enim non lacus vestibulum luctus. In commodo egestas sem eu laoreet. Maecenas sit amet est vel elit consequat rutrum. Vestibulum a massa congue, pretium ipsum id, vulputate augue. Suspendisse quis porta leo, quis consectetur lectus. Aenean pretium, orci vitae iaculis hendrerit, leo nisi varius augue, eu condimentum mi est vel neque. Nullam malesuada lobortis odio, sed viverra nulla pellentesque nec. Aliquam malesuada leo nec nisl posuere, sit amet vehicula lectus dictum. Curabitur et odio aliquam, tempor nunc euismod, egestas nibh. Pellentesque mollis urna eu tellus vulputate, vitae aliquet dui vehicula. In maximus libero non est maximus, quis sollicitudin arcu blandit. Aenean porttitor risus eros, nec rutrum urna pellentesque vel. Nulla vehicula quam eu dui tempor vulputate. Quisque lacinia libero a congue blandit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tellus lacus, maximus et lorem nec, maximus semper ipsum. Aliquam iaculis et leo quis bibendum. Proin at aliquet erat. In eleifend blandit magna at pellentesque. Fusce sed pulvinar enim. In efficitur arcu quis nibh elementum malesuada. Quisque dignissim, orci vel elementum vestibulum, magna felis lobortis leo, ut rutrum felis purus sit amet dolor. Nullam volutpat, metus quis blandit eleifend, eros metus consectetur neque, eleifend cursus turpis ante vel eros. Donec pharetra dapibus orci a lobortis. Cras arcu augue, feugiat a pellentesque ut, tristique a leo. Nulla dapibus faucibus velit, nec tristique urna tincidunt id.

Morbi mollis convallis tellus, ac porttitor neque fermentum vel. Integer volutpat ex ac rutrum mattis. Mauris vestibulum orci eget lobortis fermentum. Aenean pharetra felis erat, in pretium lectus maximus et. Suspendisse ultrices, orci ac aliquam fermentum, metus libero egestas eros, nec pellentesque est ex quis leo. Aliquam erat volutpat. Nullam eget ullamcorper tortor. Nulla elementum sem molestie dictum porttitor. Praesent malesuada vehicula pretium. Nullam tempus odio nisl.

Nunc mauris turpis, suscipit et urna non, suscipit tincidunt ante. Aliquam erat volutpat. Vestibulum facilisis nibh vel nisi pulvinar venenatis. Curabitur congue blandit lacus, nec imperdiet risus eleifend at. Maecenas maximus malesuada tincidunt. Fusce pulvinar, lacus a mattis fringilla, tellus elit sodales tortor, ut tristique ante orci ac nisi. Maecenas sed elementum turpis, a dapibus nulla. Sed quis iaculis nisl. Aliquam aliquam velit nibh, elementum gravida nulla volutpat vitae. Integer sed aliquet augue, in feugiat metus. Suspendisse luctus maximus fermentum.

Aliquam nec ipsum magna. Mauris quis tellus eget felis congue euismod in vel risus. Pellentesque quis odio dui. Phasellus sed posuere urna. Curabitur luctus, quam eu viverra fringilla, sapien dolor tristique sapien, eget scelerisque arcu est at ligula. Sed ac maximus dolor. Integer eu neque bibendum, tristique metus at, cursus arcu. Etiam dignissim, nunc eu finibus dignissim, ante erat placerat sapien, non fermentum ex lectus at eros. Nulla a nisl ipsum. Donec ex arcu, fringilla et dolor molestie, laoreet varius ligula. Nulla feugiat tristique dapibus. Donec non leo ut ligula imperdiet ultricies elementum eu massa.

Ut lobortis dui et leo consectetur euismod. Quisque vitae quam eget ex pretium ultricies sit amet vel turpis. Nam pharetra dui in felis imperdiet, vel imperdiet nunc euismod. Donec in tellus vitae ante ullamcorper efficitur. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer dignissim nec nisi in mattis. Aenean rhoncus faucibus ex vel pretium. Fusce libero elit, pretium ac vulputate quis, ultrices lacinia mi. Suspendisse et ligula quam. Donec at elit justo. Mauris nunc urna, auctor quis lacinia eu, interdum id lectus.

Mauris mi risus, faucibus molestie egestas egestas, lobortis sit amet nisl. Mauris egestas magna nec leo condimentum, et lobortis tellus volutpat. Vestibulum ac interdum lorem, eu sollicitudin metus. Nam eget ultricies sem. Mauris at est ex. Curabitur justo erat, pretium sed hendrerit non, malesuada ut nunc. Sed nec euismod sapien. Proin consequat ex eget erat pretium consequat. Etiam hendrerit scelerisque turpis eu imperdiet.

Nunc nulla ipsum, vehicula vitae nulla vitae, gravida rutrum nisi. Duis quis fermentum ligula, id venenatis nibh. Donec mi urna, suscipit vitae ligula eget, tincidunt suscipit urna. Cras commodo cursus nisl eget feugiat. Etiam maximus posuere velit, eu bibendum nisl tincidunt vitae. Mauris euismod neque ac pellentesque blandit. Aenean tempus, sapien eu sollicitudin euismod, lectus mi aliquet dolor, a congue arcu est vel turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur non porta ex.

Morbi varius metus ut egestas pharetra. In non odio a nulla tempus porttitor. Aliquam ornare nulla scelerisque pellentesque posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In sodales pretium diam, id viverra lectus volutpat at. Morbi commodo, metus vitae rhoncus rutrum, risus risus consectetur nulla, non sodales ex nisl vel lorem. Duis vitae lobortis augue, cursus molestie quam. Nam vehicula nec orci vitae molestie. Aliquam volutpat tortor quis vehicula fermentum. Vivamus fringilla odio lacus, id facilisis tellus commodo in. Ut quis varius mauris, ut posuere dolor. Ut porta magna eget elit commodo, vitae venenatis felis iaculis. Ut viverra diam elit, et sodales velit interdum non. Nulla semper purus vel condimentum aliquam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

Suspendisse eu risus at ante pulvinar facilisis et id erat. Duis bibendum, leo vel sollicitudin tempor, dolor orci hendrerit lacus, posuere tincidunt sapien ante nec risus. Vestibulum posuere turpis eu odio bibendum hendrerit. Fusce turpis ligula, tristique ac condimentum eu, luctus quis nulla. Duis ut orci neque. In ac sodales turpis. Etiam porta convallis eros, non eleifend augue luctus id. Integer dignissim convallis arcu vel dictum. Quisque justo est, vehicula eget tincidunt nec, gravida sit amet nisi. Phasellus accumsan a risus a dapibus. Vestibulum cursus arcu eget laoreet consequat. Donec volutpat sodales neque sed mollis. Nunc varius, velit sed pharetra sodales, ex massa hendrerit orci, sed egestas erat purus sed nisl. Duis at iaculis ipsum, nec imperdiet dui. Integer porttitor sodales porta.

Sed dignissim sapien vitae elit ornare ultrices. Donec dui lacus, facilisis at lectus non, varius vehicula lacus. Integer tristique turpis sed dolor viverra bibendum. Proin faucibus risus vel dignissim tincidunt. Vestibulum porttitor odio vitae cursus pulvinar. Quisque enim justo, finibus nec tellus et, finibus sodales lorem. Morbi nisi augue, cursus a purus eu, varius vestibulum tortor. Donec a massa nec neque tempor vulputate ut eu quam. Nunc eu tincidunt orci, ut elementum purus. Aenean a ex facilisis ipsum placerat vestibulum. Morbi in efficitur lorem. Nunc ut pretium nisl. Duis nec fringilla magna. Donec faucibus vehicula quam, at iaculis nibh porttitor non.

Proin consectetur congue quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut placerat sed ligula in egestas. Proin pretium bibendum imperdiet. Pellentesque ut viverra nulla, sed vulputate urna. Aenean eleifend eros in odio semper accumsan. Maecenas scelerisque mi ut dapibus venenatis. Integer pulvinar fermentum aliquam. Phasellus vestibulum ligula id euismod aliquam. Aenean quam sem, ullamcorper ut ornare non, ornare eget eros. Donec et laoreet odio, ac vestibulum magna. Suspendisse tempor est a lorem consectetur, nec luctus est commodo.

Nulla sit amet sapien porttitor, interdum lorem a, luctus metus. Donec a odio eu ligula rhoncus maximus. Sed interdum facilisis dui, sed tincidunt mi posuere sed. Etiam ligula eros, consequat id pellentesque sed, viverra non libero. Ut suscipit finibus quam id ullamcorper. Integer posuere rutrum eros nec vestibulum. Mauris at aliquam dui, at dictum mauris. Mauris aliquam nunc nisl, id pharetra elit ornare vitae. Vestibulum fringilla quis lorem eget laoreet. Integer eget pretium nunc. Integer bibendum ut enim id efficitur. Nullam euismod nibh eu dui bibendum accumsan. Nullam ultricies, diam id volutpat consectetur, dolor erat hendrerit eros, id porttitor enim mi et dui. Aenean condimentum, justo quis bibendum eleifend, ante nisi mattis lectus, at pellentesque lorem felis fringilla augue.

Pellentesque eget luctus sem. In eget arcu enim. Praesent ante turpis, efficitur eget ultrices id, pulvinar ut justo. Nam tincidunt diam sed erat lacinia elementum. Maecenas eget mauris a metus imperdiet pellentesque. Donec ipsum sem, interdum nec dolor eget, vulputate dapibus ex. Mauris metus lectus, sodales aliquet risus ac, congue rhoncus arcu. Sed odio quam, fermentum nec bibendum sed, finibus sit amet tellus. Fusce placerat pharetra enim, iaculis eleifend lectus semper a. Duis nec pulvinar massa. In accumsan auctor tincidunt. Suspendisse potenti. Proin ultrices venenatis libero. Mauris id rutrum lacus.

Duis et ante mattis, sollicitudin turpis posuere, accumsan quam. Duis eu sapien eget orci luctus ornare ac et nisl. Sed pulvinar vulputate nibh ac dapibus. Sed vehicula tincidunt lorem nec rutrum. Vivamus est sem, aliquet et fringilla quis, congue eu nibh. Aenean non augue elit. Ut tristique mi sed nibh vestibulum, lacinia dignissim dolor tempor. Praesent sed nunc consequat, ultricies nulla ut, vehicula tortor. Nam pellentesque nisl in leo accumsan aliquam. Sed ac ante sollicitudin tellus tempus interdum vel et felis. Vestibulum posuere dolor ac lacus posuere tristique. Aenean nec orci faucibus, viverra diam vel, feugiat ante.

Ut viverra blandit ipsum, quis gravida sem viverra ut. Integer risus libero, finibus in vestibulum vitae, cursus et mi. Nunc volutpat vulputate neque at mollis. Nulla cursus libero eros, sit amet fringilla eros finibus ac. Etiam sed ullamcorper sapien, sed ullamcorper enim. Praesent feugiat nulla nec turpis lacinia fringilla. Mauris at enim dictum, pharetra justo non, mollis nibh. Nullam a ligula ac nibh faucibus euismod et non lectus. Sed a gravida lorem. Phasellus fringilla diam ut nibh tempor rutrum. Aliquam ultrices quam congue massa tristique tincidunt. Integer mattis nunc turpis, nec dapibus ligula scelerisque ac. Vivamus eget consectetur magna, nec sagittis augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Aenean consectetur facilisis felis eget viverra. Nulla feugiat nisi lobortis mattis iaculis. Nullam ac risus sed arcu auctor gravida. Sed rhoncus nisi risus, ut iaculis odio hendrerit eu. Morbi tristique dignissim leo, a porta tortor malesuada quis. Nunc fringilla eu felis varius congue. Pellentesque eget neque nec elit condimentum consequat. Nunc tempus facilisis dui non tempor. Nunc egestas suscipit nisl, ut porttitor magna finibus sed. Pellentesque vel lectus est.

Vivamus vehicula enim consequat eleifend laoreet. In vitae ligula sed nunc bibendum eleifend. Donec suscipit eget neque in vehicula. Aenean placerat semper vulputate. Ut mollis ac massa viverra porttitor. Pellentesque id tortor auctor, laoreet nisl eget, rutrum elit. Suspendisse imperdiet neque eget purus cursus pharetra vitae eget nunc. Suspendisse ultricies sem augue, at porttitor justo lobortis et. Aliquam tempor interdum lobortis. Mauris orci est, mattis non convallis eget, maximus et felis. Etiam aliquam laoreet diam id volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi ante ex, congue at congue sed, faucibus sed ligula.

Nunc at sagittis turpis. In hac habitasse platea dictumst. Fusce in tortor condimentum, dapibus lorem non, lobortis purus. Sed ut felis id massa sagittis fringilla. Phasellus vitae vulputate diam. Proin eget elementum nulla. Phasellus vitae malesuada erat, eu accumsan tellus. Maecenas venenatis ornare euismod. Integer suscipit malesuada ullamcorper. Duis sem leo, pretium at auctor quis, mattis ut lectus. Vivamus auctor tortor sit amet elit fringilla, vel bibendum nibh porta. Etiam ut gravida nunc.

Donec faucibus tellus sed suscipit faucibus. Maecenas at magna eget dui tincidunt mollis id non urna. Nam fringilla elit quis suscipit hendrerit. Curabitur egestas tortor vel mauris tempor, in feugiat odio bibendum. Fusce a finibus mi, ut ultricies mauris. Mauris id ex eu sapien finibus fringilla. Aenean suscipit sem in dolor vulputate, vulputate pretium urna tempor. In volutpat, libero eget semper rhoncus, magna tellus gravida mauris, ac bibendum arcu augue sed libero. Proin blandit ornare enim, nec dapibus lectus cursus in.

Sed leo dui, suscipit et neque in, aliquet sodales ante. Ut nec magna at justo hendrerit tempus. Duis ornare id lacus at auctor. Nulla ac malesuada erat. Aliquam hendrerit est at fringilla mattis. Duis nec leo vitae nunc facilisis tristique. Maecenas elit nisi, tincidunt a lorem id, gravida tristique velit. Donec viverra lacus velit, at hendrerit magna suscipit ac. Mauris ac porta mi. Proin lobortis pharetra lacus molestie feugiat. Proin arcu tortor, feugiat iaculis diam et, tempor lobortis turpis. Donec interdum sagittis justo, in rutrum sem pharetra iaculis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec in enim eleifend, cursus sem ac, bibendum sem.

Vivamus sit amet est commodo, eleifend mi eget, pulvinar dui. Phasellus ac nisl vel nibh accumsan vulputate non non nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id nisl sagittis, condimentum elit at, faucibus risus. Nullam neque diam, tempus et viverra vitae, tempor vel velit. Nam iaculis justo nibh, vel blandit ligula auctor ut. Sed vitae quam nisl. Nullam ultricies urna massa, pellentesque faucibus orci fringilla sed. Donec posuere odio est, quis iaculis odio tincidunt et.

Ut tempor mauris sit amet molestie tempus. Maecenas quam ante, aliquam lacinia nunc ac, feugiat pharetra lorem. Nunc posuere ac felis sed hendrerit. Aliquam diam neque, venenatis et leo vel, accumsan malesuada lorem. Pellentesque eget facilisis lectus, eu facilisis magna. Aliquam congue enim id erat porttitor iaculis eu quis nibh. Nunc sapien massa, imperdiet vel risus nec, laoreet pretium mi. Morbi suscipit dui sit amet neque condimentum rutrum.

Ut turpis diam, tincidunt eu finibus at, laoreet sit amet orci. Nulla eget ex tellus. Pellentesque commodo massa id mi cursus, in bibendum velit porta. Mauris dignissim mattis ex. Etiam rhoncus tincidunt nisl, et ullamcorper massa faucibus et. Praesent placerat ac urna quis ullamcorper. Phasellus est ante, pharetra quis dolor in, porttitor semper ipsum. Curabitur tincidunt et arcu non facilisis. Sed commodo est justo, nec porttitor mi lacinia ut. Pellentesque eget imperdiet dolor, eu faucibus massa. Vivamus tempus lorem quis nisi convallis imperdiet. Mauris finibus eget ante eget sagittis. Quisque sed tortor non nibh dignissim vulputate. In rutrum leo ac quam sollicitudin malesuada. Proin accumsan nunc in gravida congue.

Vivamus sit amet arcu non lacus semper maximus. Proin tortor orci, aliquam vel ullamcorper a, ultricies eget dui. Duis euismod magna quam. Vestibulum molestie ultricies finibus. Nam id euismod massa, vel semper nisi. Phasellus tristique posuere tortor non eleifend. Fusce ultrices malesuada purus, eu condimentum ex sagittis ut. Nam sit amet mattis nibh, eu condimentum ipsum. Duis viverra, metus quis venenatis dictum, turpis diam pretium massa, at volutpat lacus ante id ex. In sollicitudin, dui quis varius vestibulum, urna ante ultrices dui, ut gravida orci velit a diam.

Donec congue ipsum ut lacus pharetra ultrices. In in mattis mi. Cras ut erat fermentum, bibendum dui id, mollis dui. Donec fermentum suscipit velit id blandit. Nunc vitae dui tristique, viverra nunc ac, blandit risus. Nullam eget pharetra est, id varius felis. Aenean posuere lorem in ultrices hendrerit. Vivamus est turpis, euismod et erat vel, volutpat ornare tellus. Fusce iaculis enim quis diam dignissim aliquet. Sed dolor velit, hendrerit id dolor at, iaculis cursus magna. Quisque molestie non mi quis viverra. Ut a suscipit tellus. Fusce feugiat, felis ut commodo finibus, ipsum ex suscipit metus, at pulvinar justo libero at purus. Cras vestibulum, orci id ultricies luctus, urna lacus rhoncus sem, ut suscipit ipsum mi in nunc.

Nulla at ullamcorper tortor. Aenean commodo quam eget tortor egestas vehicula. Suspendisse sapien nulla, congue nec mollis ut, sagittis id felis. Cras dapibus a neque nec faucibus. Curabitur mattis ornare lorem, nec dapibus quam fringilla at. Sed sapien orci, facilisis non nulla a, bibendum fermentum tellus. Quisque at libero congue, fermentum mauris at, luctus odio. Duis mollis odio ut augue tincidunt, vitae pretium lectus mollis. Praesent sed odio vestibulum nulla faucibus venenatis eget nec turpis. Nullam sit amet felis vel nunc porttitor placerat in sed tellus. Maecenas dictum dolor id finibus faucibus. Sed non diam mauris. Morbi tempus eros mollis arcu malesuada efficitur. Nunc consectetur fringilla nunc, ut hendrerit enim tincidunt in. Nunc at risus lorem.
`

var percent = function(a, b) {
  var p = ((a / b) * 100).toFixed(1);
  p = `${p}%`;
  return p;
}


var Text = function(t, type) {
  this.type = type;
  if (!this.type) { this.type = 'root'; }
  if (this.type == 'root') { ROOTTEXTS++; } else { SUBTEXTS++; }
  this.raw = t;
  if (this.type == 'root') {
    this.source = t.replace(/[ \f\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff-]+/g, ' ').trim();
    this.source = this.source.replace(/\(|\)/g, '');
  } else {
    this.source = this.raw;
  }
  this.uniqued = this.source.replace(/(\w+?)'\w+/g, '$1');
  this.uniqued_words = this.uniqued.split(' ');
  this.length = this.source.length;
  this.long_words = 0;
  this.very_long_words = 0;
  this.long_sentences = 0;
  this.very_long_sentences = 0;
  this.long_paragraphs = 0;
  this.very_long_paragraphs = 0;
  this.long_word_percent = '0%';
  this.very_long_word_percent = '0%';
  this.long_sentence_percent = '0%';
  this.very_long_sentence_percent = '0%';
  this.long_paragraph_percent = '0%';
  this.very_long_paragraph_percent = '0%';
  this.words = this.source.split(' ');
  this.word_count = this.words.length;
  this.average_word = this.average_word_length();
  this.create_wordmap();
  this.get_long_word_data();
  if (this.type != 'sentence') {
    this.sentences = this.extract_sentences();
    this.sentence_count = this.sentences.length;
    [this.average_sentence, this.average_sentence_words] = this.average_sentence_length();
    this.get_long_sentence_data();
  } else {
    this.sentences = [];
    this.sentence_count = 0;
    this.average_sentence = NaN;
    this.average_sentence_words = NaN;
  }
  if (this.type == 'root') {
    this.paragraphs = this.extract_paragraphs();
    this.paragraphs_count = this.paragraphs.length;
    [this.average_paragraph, this.average_paragraph_words, this.average_paragraph_sentences] = this.average_paragraph_data();
  } else {
    this.paragraphs = [];
    this.paragraphs_count = 0;
    this.average_paragraph = NaN;
    this.average_paragraph_words = NaN;
    this.average_paragraph_sentences = NaN;
  }
}

Text.prototype.create_wordmap = function() {
  this.wordmap = {};
  this.hapax = [];
  this.unique_words = [];
  this.most_common_word_count = 0;
  var wc = this.uniqued_words.length;
  var word;
  for (var i = 0; i < this.uniqued_words.length; i++) {
    word = this.uniqued_words[i];
    if (this.wordmap[word]) {
      this.wordmap[word]++;
    } else {
      this.wordmap[word] = 1;
    }
    if (this.wordmap[word] > this.most_common_word_count) {
      this.most_common_word_count = this.wordmap[word];
      this.most_common_word = word;
    }
  }
  for (var w in this.wordmap) {
    if (this.wordmap.hasOwnProperty(w)) {
      this.unique_words[this.unique_words.length] = w;
      if (this.wordmap[w] == 1) {
        this.hapax[this.hapax.length] = w;
      }
    }
  }
  this.most_common_word_percent = percent(this.most_common_word_count, wc);
  this.hapax_count = this.hapax.length;
  this.hapax_percent = percent(this.hapax_count, wc);
  this.unique_word_count = this.unique_words.length;
  this.unique_word_percent = percent(this.unique_word_count, wc);
}

Text.prototype.get_long_word_data = function() {
  var word;
  for (var i = 0; i < this.words.length; i++) {
    word = this.words[i];
    if (word.length >= LONGWORD) { this.long_words++; }
    if (word.length >= VERYLONGWORD) { this.very_long_words++; }
  }
  var wc = this.words.length;
  this.long_word_percent = percent(this.long_words, wc);
  this.very_long_word_percent = percent(this.very_long_words, wc);
}

Text.prototype.get_long_sentence_data = function() {
  var sentence;
  for (var i = 0; i < this.sentences.length; i++) {
    sentence = this.sentences[i];
    if (sentence.length >= LONGSENTENCE) { this.long_sentences++; }
    if (sentence.length >= VERYLONGSENTENCE) { this.very_long_sentences++; }
  }
  var sc = this.sentences.length;
  this.long_sentence_percent = percent(this.long_sentences, sc);
  this.very_long_sentence_percent = percent(this.very_long_sentences, sc);
}

Text.prototype.average_word_length = function() {
  var sum = 0;
  var word;
  for (var i = 0; i < this.words.length; i++) {
    word = this.words[i];
    sum += word.length;
  }
  return (sum / this.words.length).toFixed(1);
}

Text.prototype.average_sentence_length = function() {
  var sentence;
  var sum = 0;
  var wc_sum = 0;
  for (var i = 0; i < this.sentences.length; i++) {
    sentence = this.sentences[i];
    sum += sentence.length;
    wc_sum += sentence.word_count;
  }
  return [(sum / this.sentences.length).toFixed(1), (wc_sum / this.sentences.length).toFixed(1)];
}

Text.prototype.average_paragraph_data = function() {
  var paragraph;
  var char_sum = 0;
  var word_sum = 0;
  var sent_sum = 0;
  var pl = this.paragraphs.length;
  for (var i = 0; i < pl; i++) {
    paragraph = this.paragraphs[i];
    char_sum += paragraph.length;
    word_sum += paragraph.word_count;
    sent_sum += paragraph.sentence_count;
  }
  return [(char_sum/pl).toFixed(1), (word_sum/pl).toFixed(1), (sent_sum/pl).toFixed(1)];
}

Text.prototype.extract_sentences = function() {
  var spat = /[^\.]+?\./g;
  var r = true;
  var s = [];
  var t = [];
  while (r) {
    r = spat.exec(this.source);
    if (r) { s[s.length] =r[0]; }
  }
  if (s.length > 1) {
    var sent;
    for (var i = 0; i < s.length; i++) {
      sent = s[i];
      t[t.length] = new Text(sent, 'sentence');
    }
  }
  return t;
}

Text.prototype.extract_paragraphs = function() {
  var spat = /(.+?)(?=\n+|$)/g;
  var r = true;
  var s = [];
  var t = [];
  while (r) {
    r = spat.exec(this.source);
    if (r) { s[s.length] =r[0]; }
  }
  if (s.length > 1) {
    var sent;
    for (var i = 0; i < s.length; i++) {
      sent = s[i];
      t[t.length] = new Text(sent, 'paragraph');
    }
  }
  return t;
}

var start = Date.now();
var comp = new Text(TESTDATA);
var finish = Date.now() - start;
var cms = (comp.length / finish).toFixed(1);
console.log(`
------------------------------------
  Text:
    Characters: ${comp.length}
    Words: ${comp.word_count}
    Average word length: ${comp.average_word}
    Long words: ${comp.long_words} / ${comp.long_word_percent}
    Very long words: ${comp.very_long_words} / ${comp.very_long_word_percent}
    Long sentences: ${comp.long_sentences} / ${comp.long_sentence_percent}
    Very long sentences: ${comp.very_long_sentences} / ${comp.very_long_sentence_percent}
    Hapaxes: ${comp.hapax_count} / ${comp.hapax_percent}
    Most common word: '${comp.most_common_word}' / ${comp.most_common_word_count} / ${comp.most_common_word_percent}
    Unique words: ${comp.unique_word_count} / ${comp.unique_word_percent}
  Sentences: ${comp.sentence_count}
    Average characters: ${comp.average_sentence}
    Average words: ${comp.average_sentence_words}
  Paragraphs: ${comp.paragraphs_count}
    Average characters: ${comp.average_paragraph}
    Average words: ${comp.average_paragraph_words}
    Average sentences: ${comp.average_paragraph_sentences}

  Created ${SUBTEXTS} ${SUBTEXTS > 1 ? 'subtexts' : 'subtext'} from ${ROOTTEXTS} root ${ROOTTEXTS > 1 ? 'texts' : 'text'}
  Runtime: ${finish}ms | ${cms}c/ms
------------------------------------
`);

// percentage of long words
// unique words vs. word count (lexical density)
// number of hapax legomenon (and vs. expected average thereof)
