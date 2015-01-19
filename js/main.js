
;( function( window ) {
  
  'use strict';

  var document = window.document;

  if (!String.prototype.trim) {
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
  }

  function NLForm( el ) { 
    this.el = el;
    this.overlay = this.el.querySelector( '.nl-overlay' );
    this.fields = [];
    this.fldOpen = -1;
    this._init();
  }

  NLForm.prototype = {
    _init : function() {
      var self = this;
      Array.prototype.slice.call( this.el.querySelectorAll( 'select' ) ).forEach( function( el, i ) {
        self.fldOpen++;
        self.fields.push( new NLField( self, el, 'dropdown', self.fldOpen ) );
      } );
      Array.prototype.slice.call( this.el.querySelectorAll( 'input' ) ).forEach( function( el, i ) {
        self.fldOpen++;
        self.fields.push( new NLField( self, el, 'input', self.fldOpen ) );
      } );
      this.overlay.addEventListener( 'click', function(ev) { self._closeFlds(); } );
      this.overlay.addEventListener( 'touchstart', function(ev) { self._closeFlds(); } );
    },
    _closeFlds : function() {
      if( this.fldOpen !== -1 ) {
        this.fields[ this.fldOpen ].close();
      }
    }
  }

  function NLField( form, el, type, idx ) {
    this.form = form;
    this.elOriginal = el;
    this.pos = idx;
    this.type = type;
    this._create();
    this._initEvents();
  }

  NLField.prototype = {
    _create : function() {
      if( this.type === 'dropdown' ) {
        this._createDropDown(); 
      }
      else if( this.type === 'input' ) {
        this._createInput();  
      }
    },
    _createDropDown : function() {
      var self = this;
      this.fld = document.createElement( 'div' );
      this.fld.className = 'nl-field nl-dd';
      this.toggle = document.createElement( 'a' );
      this.toggle.innerHTML = this.elOriginal.options[ this.elOriginal.selectedIndex ].innerHTML;
      this.toggle.className = 'nl-field-toggle';
      this.optionsList = document.createElement( 'ul' );
      var ihtml = '';
      Array.prototype.slice.call( this.elOriginal.querySelectorAll( 'option' ) ).forEach( function( el, i ) {
        ihtml += self.elOriginal.selectedIndex === i ? '<li class="nl-dd-checked">' + el.innerHTML + '</li>' : '<li>' + el.innerHTML + '</li>';
        // selected index value
        if( self.elOriginal.selectedIndex === i ) {
          self.selectedIdx = i;
        }
      } );
      this.optionsList.innerHTML = ihtml;
      this.fld.appendChild( this.toggle );
      this.fld.appendChild( this.optionsList );
      this.elOriginal.parentNode.insertBefore( this.fld, this.elOriginal );
      this.elOriginal.style.display = 'none';
    },
    _createInput : function() {
      var self = this;
      this.fld = document.createElement( 'div' );
      this.fld.className = 'nl-field nl-ti-text';
      this.toggle = document.createElement( 'a' );
      this.toggle.innerHTML = this.elOriginal.getAttribute( 'placeholder' );
      this.toggle.className = 'nl-field-toggle';
      this.optionsList = document.createElement( 'ul' );
      this.getinput = document.createElement( 'input' );
      this.getinput.setAttribute( 'type', 'text' );
      this.getinput.setAttribute( 'placeholder', this.elOriginal.getAttribute( 'placeholder' ) );
      this.getinputWrapper = document.createElement( 'li' );
      this.getinputWrapper.className = 'nl-ti-input';
      this.inputsubmit = document.createElement( 'button' );
      this.inputsubmit.className = 'nl-field-go';
      this.inputsubmit.innerHTML = 'Go';
      this.getinputWrapper.appendChild( this.getinput );
      this.getinputWrapper.appendChild( this.inputsubmit );
      this.example = document.createElement( 'li' );
      this.example.className = 'nl-ti-example';
      this.example.innerHTML = this.elOriginal.getAttribute( 'data-subline' );
      this.optionsList.appendChild( this.getinputWrapper );
      this.optionsList.appendChild( this.example );
      this.fld.appendChild( this.toggle );
      this.fld.appendChild( this.optionsList );
      this.elOriginal.parentNode.insertBefore( this.fld, this.elOriginal );
      this.elOriginal.style.display = 'none';
    },
    _initEvents : function() {
      var self = this;
      this.toggle.addEventListener( 'click', function( ev ) { ev.preventDefault(); ev.stopPropagation(); self._open(); } );
      this.toggle.addEventListener( 'touchstart', function( ev ) { ev.preventDefault(); ev.stopPropagation(); self._open(); } );

      if( this.type === 'dropdown' ) {
        var opts = Array.prototype.slice.call( this.optionsList.querySelectorAll( 'li' ) );
        opts.forEach( function( el, i ) {
          el.addEventListener( 'click', function( ev ) { ev.preventDefault(); self.close( el, opts.indexOf( el ) ); } );
          el.addEventListener( 'touchstart', function( ev ) { ev.preventDefault(); self.close( el, opts.indexOf( el ) ); } );
        } );
      }
      else if( this.type === 'input' ) {
        this.getinput.addEventListener( 'keydown', function( ev ) {
          if ( ev.keyCode == 13 ) {
            self.close();
          }
        } );
        this.inputsubmit.addEventListener( 'click', function( ev ) { ev.preventDefault(); self.close(); } );
        this.inputsubmit.addEventListener( 'touchstart', function( ev ) { ev.preventDefault(); self.close(); } );
      }

    },
    _open : function() {
      if( this.open ) {
        return false;
      }
      this.open = true;
      this.form.fldOpen = this.pos;
      var self = this;
      this.fld.className += ' nl-field-open';
    },
    close : function( opt, idx ) {
      if( !this.open ) {
        return false;
      }
      this.open = false;
      this.form.fldOpen = -1;
      this.fld.className = this.fld.className.replace(/\b nl-field-open\b/,'');

      if( this.type === 'dropdown' ) {
        if( opt ) {
          // remove class nl-dd-checked from previous option
          var selectedopt = this.optionsList.children[ this.selectedIdx ];
          selectedopt.className = '';
          opt.className = 'nl-dd-checked';
          this.toggle.innerHTML = opt.innerHTML;
          // update selected index value
          this.selectedIdx = idx;
          // update original select element´s value
          this.elOriginal.value = this.elOriginal.children[ this.selectedIdx ].value;
        }
      }
      else if( this.type === 'input' ) {
        this.getinput.blur();
        this.toggle.innerHTML = this.getinput.value.trim() !== '' ? this.getinput.value : this.getinput.getAttribute( 'placeholder' );
        this.elOriginal.value = this.getinput.value;
      }
    }
  }

  // add to global namespace
  window.NLForm = NLForm;

} )( window );





$(document).ready(function(){

  var nlform = new NLForm( document.getElementById( 'nl-form' ) );

	$('#mainScreen').hide();
	$('#firstTimeScreen').hide();
  	$('#loginTriged').hide();
  	$('#loginLoading').fadeOut();
    $('.container').hide();
	Parse.initialize("KC1eJ0pORqFD9mnj6jxrFTKlHKE5Ou32d8ULgOkR", "DiSSicuCql0ZE9FH4tghrRDY5pv8CZtQMq7jBipQ");
	
	function signIn(){

    var username = $('#usr').val();
    var password = $('#psw').val();
    window.Usersname = username;
    $.cookie('username', username, { expires: 7, path: '/' });
    Parse.User.logIn(username, password, {
      success: function (user) {
        //Authentication
        var Auth = Parse.Object.extend('User');
        var query = new Parse.Query(Auth);
        query.equalTo('username', Usersname);
        query.find({
          success: function (results)
          {
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var firstTime = object.get("FirstTime");
              if (firstTime) {
              		
                  askQuestions();

              }else if(!firstTime){
              		$('#logInForm').fadeOut( 200 );
              		window.location.replace("DragDropInteractions/index.html");
              }
               
              
            }
          },
          error: function (error) {
            alert(error.message);
          }
        });
        //End Authentication
      },
      error: function (user, error) {
        alert('Sorry, those login details are incorrect.');
      }
    });
	}

  function askQuestions(){
    $("link[id='logincss']").attr('href', '');
    $("link[id='grabData_def']").attr('href', 'css/grabData/default.css');
    $("link[id='grabData_comp']").attr('href', 'css/grabData/component.css');
    

    $('#start').fadeOut(200);
    $('.container').fadeIn(100);


    


  }

  function startMainDrag(){

    $('.container').fadeOut(100);
    $("link[id='grabData_def']").attr('href', '');
    $("link[id='grabData_comp']").attr('href', '');

  }


	$('#logInSubmit').click(function(){
		  signIn();
	});
  $('#logInTrigger').click(function(){

    $('#furst').fadeOut(1);
    $('#loginTriged').fadeIn( 900 );

  });

  $('#a').click(function(){
      event.preventDefault();
      var Homework = Parse.Object.extend("UserSpecifiedInfo");
       var homework = new Homework();

       var subject = $('#q1').val();
       var studentName = $('#q2').val();
       var hlcontent = $('#q3').val();
       var subject1 = $('#q4').val();
       var studentName2 = $('#q5').val();
       var hlcontent3 = $('#q6').val();
 
        homework.set("q1", subject);
        homework.set("q2", studentName);
        homework.set("q3", hlcontent);
        homework.set("q4", subject1);
        homework.set("q5", studentName2);
        homework.set("q6", hlcontent3);
 
        homework.save(null, {
          success: function(tableobject) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + tableobject.id);
            var SubjectSaveId = tableobject.id

            window.location.replace("../mstapp/DragDropInteractions/index.html"); 
          },
          error: function(tableobject, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            alert('Failed to create new object, with error code: ' + error.description);
          }
        });

  });


$('#submitnl').click( 
              function(event){

                event.preventDefault();

                

                  var putUserData = Parse.Object.extend('profileData');
                var userData = new putUserData();
                var perfName = $('#asdf').val();
                var site = $('#asd').val();
                var building = $('#as').val();
                var floor = $('#ad').val();
                var user = $.cookie('username');
                userData.set('User', user);
                userData.set('perfName', perfName);
                userData.set('site', site);
                userData.set('building', building);
                userData.set('floor', floor);
                userData.save(null, {
                success: function (tableobject) {
                  // Execute any logic that should take place after the object is saved.

                  alert('New object created with objectId: ' + tableobject.id);
                  var SubjectSaveId = tableobject.id



                    var user = Parse.User.current();
                    alert(user);

                    user.save(null, {
                      success: function(user) {
                        user.set("FirstTime", false);
                        user.save();
                      }
                    });



                  window.location.replace("../DragDropInteractions/index.html");

                  startMainDrag();

                },
                error: function (tableobject, error) {
                  // Execute any logic that should take place if the save fails.
                  // error is a Parse.Error with an error code and description.
                  alert('Failed to create new object, with error code: ' + error.description);
                }
              });
            

                });

  $('#loog').submit(function(event){
  	event.preventDefault();
    signIn();
  });

});