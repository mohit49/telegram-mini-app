////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
 function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'/images/plinko/background.png', id:'background'},
			{src:'/images/plinko/background_p.png', id:'backgroundP'},
			{src:'/images/plinko/logo.png', id:'logo'},
			{src:'/images/plinko/logo_p.png', id:'logoP'},
			{src:'/images/plinko/button_start.png', id:'buttonStart'},
			
			{src:'/images/plinko/item_ball.png', id:'itemBall'},
			{src:'/images/plinko/button_arrow_left.png', id:'buttonArrowL'},
			{src:'/images/plinko/button_arrow_right.png', id:'buttonArrowR'},
			{src:'/images/plinko/button_bet_half.png', id:'buttonBetHalf'},
			{src:'/images/plinko/button_bet_multiply.png', id:'buttonBetMultiply'},
			{src:'/images/plinko/button_blank.png', id:'buttonBlank'},
			{src:'/images/plinko/item_drag_bar.png', id:'itemDragBar'},
			{src:'/images/plinko/item_drag.png', id:'itemDrag'},
			{src:'/images/plinko/item_stat_display.png', id:'itemStatDisplay'},
			{src:'/images/plinko/item_plinko.png', id:'itemPlinko'},
			{src:'/images/plinko/item_plinko_p.png', id:'itemPlinkoP'},

			{src:'/images/plinko/button_confirm.png', id:'buttonConfirm'},
			{src:'/images/plinko/button_cancel.png', id:'buttonCancel'},
			{src:'/images/plinko/item_exit.png', id:'itemExit'},
			{src:'/images/plinko/item_exit_p.png', id:'itemExitP'},
		
			{src:'/images/plinko/button_continue.png', id:'buttonContinue'},
			
			{src:'/images/plinko/item_result.png', id:'itemResult'},
			{src:'/images/plinko/item_result_p.png', id:'itemResultP'},
			{src:'/images/plinko/button_facebook.png', id:'buttonFacebook'},
			{src:'/images/plinko/button_twitter.png', id:'buttonTwitter'},
			{src:'/images/plinko/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'/images/plinko/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'/images/plinko/button_sound_on.png', id:'buttonSoundOn'},
			{src:'/images/plinko/button_sound_off.png', id:'buttonSoundOff'},
			{src:'/images/plinko/button_exit.png', id:'buttonExit'},
			{src:'/images/plinko/button_settings.png', id:'buttonSettings'}];
	
	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership){
		addMemberRewardAssets();
	}
	
	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}else{
		if(!enableDesktopSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'/images/plinko/sounds/sound_result.ogg', id:'soundResult'});
		manifest.push({src:'/images/plinko/sounds/sound_button.ogg', id:'soundClick'});
		manifest.push({src:'/images/plinko/sounds/sound_start.ogg', id:'soundStart'});
		manifest.push({src:'/images/plinko/sounds/sound_win.ogg', id:'soundWin'});
		manifest.push({src:'/images/plinko//sounds/sound_nowin.ogg', id:'soundLose'});
		manifest.push({src:'/images/plinko/sounds/sound_score.ogg', id:'soundScore'});
		manifest.push({src:'/images/plinko/sounds/sound_noscore.ogg', id:'soundNoScore'});
		manifest.push({src:'/images/plinko/sounds/sound_change.ogg', id:'soundChange'});
		manifest.push({src:'/images/plinko/sounds/sound_ball.ogg', id:'soundBall'});
		manifest.push({src:'/images/plinko/sounds/sound_hit.ogg', id:'soundHit'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}