var colors = [1,4,6,8,9,11,17,18,20,21,23,24,26,29,32,34,38,40,43,47,50,53,55,56,58,59,62,63,64,68,72,74,78,80,82,85,86,87,91,96,101,104,107,110,112,115,120,124,126,129,131,132,134,141,145,146,149,150,154,157,158,160,163,165,169,174,176,33,35,19,46,172,173,5,114,130,127,75,89,79,81,42,121,116,177,152,159,142,66,49,12,27,103,148,133,60,3,13,67,70,90,93,102,105,118,138,164,122,175,108,41,45,88,36,100,153,65,14,28,168,156,144,98,143,71,57,25,106,16,92,7,162,123,77,51,48,30,139,109,113,76,99,136,94,54,10,39,52,69,31,61,73,84,83,95,128,140,125,166,171,155,137,2,167,135,147,111,161,151,170,119,117,97,44,37,22,15];

function validateInput(input){
  var idPattern = /[0-9]{1,9}/;
  var imgPattern = /(https:\/\/)?www1.flightrising.com\/dgen\/preview\/dragon\?age=[0-9]+&body=[0-9]+&bodygene=[0-9]+&breed=[0-9]+&element=[0-9]+&eyetype=[0-9]+&gender=[0-9]+&tert=[0-9]+&tertgene=[0-9]+&winggene=[0-9]+&wings=[0-9]+&auth=[0-9a-zA-Z&=.]+/g;
  var urlPattern = /(https:\/\/)?www1.flightrising.com\/scrying\/predict\?breed=[0-9]+&gender=[0-9]+&age=[0-9]+&bodygene=[0-9]+&body=[0-9]+&winggene=[0-9]+&wings=[0-9]+&tertgene=[0-9]+&tert=[0-9]+&element=[0-9]+&eyetype=[0-9]+/g;
  input = input.trim();
  var found = input.match(idPattern);
  if (found == input){
    return "id";
  }
  else if (found = input.match(urlPattern) == input){
    return "scry";
  }
  else if (found = input.match(imgPattern) == input){
    return "scry";
  }
  else return "";
}

//slot: A, B, or "" for hatchling
function importDragon(prefix, slot, url){
  var elemName, val;
  // check if tab + import breed match
  if (!isCorrectTab(prefix, slot, url)){
    window.alert("wrong breed type for this tab");
    return;
  }
  // breed
  val = url.match("breed=[0-9]+")[0].replace("breed=","");
  setElement(prefix+"breed"+slot,val, true);
  // primary
  val = url.match("&body=[0-9]+")[0].replace("&body=","");
  setElement(prefix+"primarycolor"+slot,val, true);
  val = url.match("&bodygene=[0-9]+")[0].replace("&bodygene=","");
  setElement(prefix+"priGene"+slot,val, true);
  // secondary
  val = url.match("&wings=[0-9]+")[0].replace("&wings=","");
  setElement(prefix+"secondarycolor"+slot,val, true);
  val = url.match("&winggene=[0-9]+")[0].replace("&winggene=","");
  setElement(prefix+"secGene"+slot,val, true);
  // tertiary
  val = url.match("&tert=[0-9]+")[0].replace("&tert=","");
  setElement(prefix+"tertiarycolor"+slot,val, true);
  val = url.match("&tertgene=[0-9]+")[0].replace("&tertgene=","");
  setElement(prefix+"tertGene"+slot,val, true);
}

function importResults(prefix, slot, data){
  var dataArray = data.split("-");
  // breed
  setElement(prefix+"breed"+slot,dataArray[0], false);
  // primary
  setElement(prefix+"primarycolor"+slot,dataArray[1], false);
  setElement(prefix+"priGene"+slot,dataArray[2], false);
  // secondary
  setElement(prefix+"secondarycolor"+slot,dataArray[3], false);
  setElement(prefix+"secGene"+slot,dataArray[4], false);
  // tertiary
  setElement(prefix+"tertiarycolor"+slot,dataArray[5], false);
  setElement(prefix+"tertGene"+slot,dataArray[6], false);
  if (dataArray.length > 7){
    // pose
    document.getElementById(prefix+"pose").selectedIndex = dataArray[10];
    // range colors + toggles
    if (dataArray[11] == 1){
      document.getElementById(prefix+"primaryToggle").checked = true;
      setElement(prefix+"primary_range", dataArray[7], true);
    }
    if (dataArray[12] == 1){
      document.getElementById(prefix+"secondaryToggle").checked = true;
      setElement(prefix+"secondary_range", dataArray[8], true);
    }
    if (dataArray[13] == 1){
      document.getElementById(prefix+"tertiaryToggle").checked = true;
      setElement(prefix+"tertiary_range", dataArray[9], true);
    }
  }
}

function setElement(elemName, val, isScry){
  var i, opt, elem = document.getElementById(elemName), valNum = parseInt(val, 10);
  if (elemName.match("color") != null){
    if (isScry) elem.selectedIndex = colors[val-1];
    else elem.selectedIndex = val;
  }
  else {
    for (i=0;i<elem.options.length;i++){
      opt = elem.options[i].value;
      if (opt.split("_")[0] == val){
        elem.selectedIndex = i;
        break;
      }
    }
  }
}

function isCorrectTab(prefix, slot, url){
  val = url.match("&bodygene=[0-9]+")[0].replace("&bodygene=","");
  elem = document.getElementById(prefix+"priGene"+slot);
  for (i=0;i<elem.options.length;i++){
    opt = elem.options[i].value;
    if (opt.split("_")[0] == val){
      return true;
    }
  }
  return false;
}
