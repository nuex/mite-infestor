// ==UserScript==
// @name        MiteInfestor
// @description Infest the DOM with mites
// @namespace   http://nu-ex.com/mite-infestor
// ==/UserScript==
(function(){

  var context = this;

  var $infestor = {

    hive: 'http://mitesrv.nu-ex.com',
    //hive: 'http://localhost:3030',

    context: context,

    mites: [],

    mite: {

      next_position: function(){

      },

      dom: null

    },

    /*!
    Math.uuid.js (v1.4)
    http://www.broofa.com
    mailto:robert@broofa.com

    Copyright (c) 2010 Robert Kieffer
    Dual licensed under the MIT and GPL licenses.
    */
    uuid: function(){
      // Private array of chars to use
      var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

      // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
      // by minimizing calls to random()
      var chars = CHARS, uuid = new Array(36), rnd=0, r;
      for (var i = 0; i < 36; i++) {
        if (i==8 || i==13 ||  i==18 || i==23) {
          uuid[i] = '-';
        } else {
          if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
          r = rnd & 0xf;
          rnd = rnd >> 4;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
      return uuid.join('');
    },

    rand: function(limit){
      return Math.floor(Math.random() * limit);
    },

    log: function(str){
      if(typeof(console) != 'undefined') console.log(str);
    },

    key: function(){
      if(typeof(GM_getValue('infestor_key')) == 'undefined') {
        GM_setValue('infestor_key', $infestor.uuid());
      }
      return GM_getValue('infestor_key');
    },

    uri: context.location.href,

    infest: function(){
      this.log('Calling mitez... ');
      GM_xmlhttpRequest({
        method: 'POST',
        url: this.hive + '/infest',
        data: 'key=' + this.key() + '&uri=' + this.uri,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function(r){
          if(r.status == 200 && !r.responseText.match('errors')) {
            eval('var data = (' + r.responseText + ')');
            $infestor.spawn_mites(data);
            $infestor.log('Infested!');
          } else {
            $infestor.log('FAILED');
          }
        }
      });
    },

    add_mite: function(){
      var body_tag = document.getElementsByTagName('body')[0];
      var mite = document.createElement('div');
      mite.setAttribute('class', 'mite');
      mite.style.backgroundColor = '#000';
      mite.style.width = '10px';
      mite.style.height = '10px';
      mite.style.position = 'fixed';
      mite.style.top = this.rand(this.context.innerHeight) + 'px';
      mite.style.left = this.rand(this.context.innerWidth) + 'px';
      body_tag.appendChild(mite);
    },

    bring_to_life: function(){
      // TODO
    },

    spawn_mites: function(data){
      for(i in data.mites) this.add_mite();
      this.bring_to_life();
    }
  };

  $infestor.log('Infestor Initialized');
  $infestor.log('Infestor Key: ' + $infestor.key());
  $infestor.log('    Hive URI: ' + $infestor.hive);
  $infestor.log(' Current URI: ' + $infestor.uri);

  $infestor.infest();
})();
