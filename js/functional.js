var i, isChecked, elementName;

jQuery(document).ready(function(){
	$(".chosen").chosen({ width:'130px' });
	$(".chosen-small").chosen({ width:'100px' });
	//console.log(window.location.href);
    //console.log(window.location.pathname);
	processUrl(window.location.href);

//hide all color range elements unless box is already checked on load
	var checkboxes = document.getElementsByClassName("rangetoggle");
	for (i=0;i<checkboxes.length;i++){
		isChecked = checkboxes[i].checked;
		elementName = checkboxes[i].id.replace("Toggle", "_range");
		if (!isChecked){
					document.getElementById(elementName).style.display = "none";
				}
				else {
					$("#"+elementName).chosen({ width:'130px' });
				}
	}
	//event listener for breed tabs
	$(".tablink").click(function(event){
		var type = this.name.replace("Tab", "");
		var isAncient = true;
		if (type == "Modern"){
			isAncient = false;
		}
		openTab(type, isAncient);
	})
	//scry import boxes
	$(".import").focusout(function(event){
		var inp = this.value, type = validateInput(inp), url;
		var prefix = this.id.slice(0,2), slot = this.id.slice(-1);
		if (slot == "t"){
			slot = "";
		}
		if (type == "") {
			console.log("invalid input");
			return;
		}
		else if (type == "id"){
			url = getScryUrl(inp);
			console.log("id found");
		}
		else if (type == "scry"){
			url = inp;
			importDragon(prefix, slot, url);
		}
		$(".chosen").chosen("destroy");
		$(".chosen").chosen({ width:'130px' });
		this.value = "";
	})
	//global range option toggle
	optionBoxes = document.getElementsByClassName("rangeopt");
	$(".rangeopt").click(function(event){
		checkval = this.checked;
		for (i=0;i<optionBoxes.length;i++){
			optionBoxes[i].checked = checkval;
		}
	})
	//event listener for range toggles
	$(".rangetoggle").click(function(event){
		var name = this.id.replace("Toggle", "_range");
		if (this.checked) {
			document.getElementById(name).style.display = "block";
			$("#"+name).chosen({ width:'130px' });
		}
		else {
			$("#"+name).chosen("destroy");
			document.getElementById(name).style.display = "none";
		}
		})

	$(".calculate").click(function(){
		var singlePrimary = true, singleSecondary = true, singleTertiary = true;
		var type = this.name;
		document.getElementById(type+"res-heading").innerHTML = "<b>Results:</b>";
		document.getElementById(type+"export").style.display = "block";
		document.getElementById(type+"exp-heading").innerHTML = "<b>URL for this result:</b>";
		//get range/single color status
		if (document.getElementById(type + "primaryToggle").checked) singlePrimary = false;
		if (document.getElementById(type + "secondaryToggle").checked) singleSecondary = false;
		if (document.getElementById(type + "tertiaryToggle").checked) singleTertiary = false;
		readForm(type, singlePrimary, singleSecondary, singleTertiary);
	})
});

function tabOnLoad(type){
	var activeTab = document.getElementById(type+"Tab"), isAncient;
	activeTab.className += " active";
	isAncient = (type == "m_") ? true : false;
	openTab(type,isAncient);
}

function openTab(type, isAncient) {
  var i, tabcontent, tablinks, breedEl;
  // hide all inactive tabs
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  // remove "active" description from all tabs
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // add "active" description to current tab
	document.getElementById(type + "Tab").className += " active"
  document.getElementById(type).style.display = "block";
}

function processUrl(path){
	var pathx = path.split("&"), type;
    var optionBoxes = document.getElementsByClassName("rangeopt");
	if (pathx.length == 1){
		tabOnLoad("m_");
		return;
	}
	type = pathx[0].split("?")[1].replace();
	tabOnLoad(type);

	importResults(type, "A", pathx[1]);
	importResults(type, "B", pathx[2]);
	importResults(type, "", pathx[3]);
	if (pathx[4] == "0"){
		for (i=0;i<optionBoxes.length;i++){
			optionBoxes[i].checked = true;
		}
	}
	else {
		for (i=0;i<optionBoxes.length;i++){
			optionBoxes[i].checked = false;
		}
	}
	$(".chosen").chosen("destroy");
	$(".chosen").chosen({ width:'130px' });
}
