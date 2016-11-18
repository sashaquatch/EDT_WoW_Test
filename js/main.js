$(document).ready(function(){
	
	//set the character name to fade
	var input = document.getElementsByTagName("input");
	
	//make the under construction popup
	$('#woops').popup({ transition: 'all 0.3s'});
	
	//loop through all our inputs --- here we only have 1, but this is sweet and reusable
	for(var i = 0; i < input.length; i++)
	{
		//get the placeholder text
		input[i].value = input[i].getAttribute('data-placeholder');
		
		//add an event listener to get rid of our placeholder text
		input[i].addEventListener('focus',function(){
			if(this.value == this.getAttribute('data-placeholder')){
				this.value = '';
			}
		});

		//add an event listener to put our text back in
		input[i].addEventListener('blur',function(){			
			//check to see if the value is empty, if so put our original text back in
			if(this.value == ''){
				this.value = this.getAttribute('data-placeholder');
			}
		});	
	}
	
	var realmData = "https://us.api.battle.net/wow/realm/status?locale=en_US&apikey=tcvhttwk728xqph5ybcuy9p5v4magag7";
	
	//get the select here
	var realmPlace = document.getElementById('realmName');
	
	//make the ajax call for all of the realms
	//we are preloading the EN_US realms into a select for the user
	return $.ajax({
        url:realmData,
		type:'GET',
		dataType: 'json',
		data:{

		},
		success: function (json){

			//go through all the realms and check if they are en_US realms
			$.each(json.realms,function(k, realm){
				
				//create an option to append to the select
				var o = document.createElement('option');
				o.setAttribute('value',realm.name);
				
				//if it is Dalaran for our boy Regex, but that as the selected option
				if(realm.name =="Dalaran"){
					o.setAttribute('selected','selected');
				}
				
				//put it on the select
				o.appendChild(document.createTextNode(realm.name));
				realmPlace.appendChild(o);
			});
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
           //this shouldn't ever fire, but if it does we'll send an alert.
		   alert("Error getting Realm Data: " + errorThrown);
        }
    });
	
	
	//myXhr('get',{path: testData},testId).done(function(json){
});

function getUser(){
	
	var wowKey = "tcvhttwk728xqph5ybcuy9p5v4magag7";
	
	var characterName = document.getElementById('characterName').value;
	
	var o = document.getElementById('realmName');
	
	//setup the url we are hitting
	var testData = "https://us.api.battle.net/wow/character/" + o.options[o.selectedIndex].value + "/" + characterName +"?fields=stats,items&locale=en_US&apikey=" + wowKey;
	
	return $.ajax({
        url:testData,
		type:'GET',
		dataType: 'json',
		data:{

		},
		success: function (json) {
			//get the attributes and set them
			checkNum(json.stats.str,'strength');
			checkNum(json.stats.agi,'agility');
			checkNum(json.stats.int,'intellect');
			checkNum(json.stats.sta,'stamina');
			
			//get the attack
			document.getElementById('damage').innerHTML = json.stats.mainHandDmgMin + " - " + json.stats.mainHandDmgMax;
			document.getElementById('speed').innerHTML = truncateDec(json.stats.mainHandSpeed,2) + "/" + truncateDec(json.stats.mainHandDps,2);
			
			//check the mana regen
			if(json.stats.manaRegen != null){
				document.getElementById('manaRegen').innerHTML = json.stats.manaRegen;
			}
			else{
				document.getElementById('manaRegen').innerHTML = "--";
			}
			
			//get the defense
			checkNum(json.stats.armor,'armor');
			checkPerc(json.stats.dodge,'dodge');
			checkPerc(json.stats.parry,'parry');
			checkPerc(json.stats.block,'block');
			
			//get the enhancements
			checkPerc(json.stats.crit,'crit');
			checkPerc(json.stats.haste,'haste');
			checkPerc(json.stats.mastery,'mastery');
			checkPerc(json.stats.leech,'leech');
			checkPerc(json.stats.versatility,'versatility');
		
			$.each(json.items,function(i,itemObj){
				if(itemObj.name != null)
				{
					//get/write more details for the objects
					getItem(itemObj.id);
				}
				else{
					
				}
			});
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
           alert("Invalid username, error: " + errorThrown);
        }
    });
}

function checkNum(num,id)
{
	var d = document.getElementById(id);
	//if the number is bigger than 350 let's make it big
	if(num >= 350){
		d.innerHTML = num.toLocaleString();
		d.style.color ="#1c9a93";
	}
	else{
		d.innerHTML = num.toLocaleString();
		d.style.color = '#faefe8';
	}
}

function checkPerc(num, id){
	//get the percent's id this is for ease later
	var d = document.getElementById(id);
	
	//if the number is > than 50% lets make it blue
	if(num >= 50){
		//check to see if there are any decimals
		if(num.toLocaleString().indexOf(".") == -1)
		{
			//if no decimals, we'll add some 0s to the end
			d.innerHTML = truncateDec(num,2).toLocaleString() + ".00%";
			d.style.color ="#1c9a93";
		}
		else{
			//decimals, don't add .00
			d.innerHTML = truncateDec(num,2).toLocaleString() + "%";
			d.style.color ="#1c9a93";
		}
	}
	else{
		// if it isn't >  50% we here and we rolling
		if(num.toLocaleString().indexOf(".") == -1)
		{
			d.innerHTML = truncateDec(num,2).toLocaleString() + ".00%";
			d.style.color = '#faefe8';
		}
		else{
			d.innerHTML = truncateDec(num,2).toLocaleString() + "%";
			d.style.color = '#faefe8';
		}
	}
	
}

function getItem(itemId){
	
	//this is where we will be travelling tonight
	var urlGo = "https://us.api.battle.net/wow/item/"+itemId+"?locale=en_US&apikey=tcvhttwk728xqph5ybcuy9p5v4magag7";
	
	//get the item list
	var itemList = document.getElementById('itemList');
	
	//make the picture before we go into the JSON
	var itemImg = document.createElement('img');
	itemImg.setAttribute('class','coinImg');
	itemImg.setAttribute('src','img/coin.png');
	itemImg.setAttribute('alt','coin image');
	
	return $.ajax({
    url:urlGo,
	type:'GET',
	dataType: 'json',
	data:{

	},
	success: function (json) {
		
		//Create the type of the item first
		var i1 = document.createElement('li');
		i1.setAttribute('class','itemLi');
		i1.appendChild(document.createTextNode(getType(json.inventoryType)));
		
		//create the li that holds the name of the item
		var i2 = document.createElement('li');
		i2.setAttribute('class','midStat itemLi');
		i2.setAttribute('id',itemId);
		i2.appendChild(document.createTextNode(json.name));
		
		//create the li that holds the buyprice of the item
		var i3 = document.createElement('li');
		i3.setAttribute('class','rightStat itemLi');
		i3.setAttribute('id',itemId +'Cost');
		i3.appendChild(document.createTextNode(json.buyPrice.toLocaleString() + " "));
		i3.appendChild(itemImg);
		
		//append the children to the master list
		itemList.appendChild(i1);
		itemList.appendChild(i2);
		itemList.appendChild(i3);
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
       alert("Error getting item: " + errorThrown);
    }	
});
}

//This is a method that tells us what type an item is.
//API doesn't have the type but has a number that can tell us what type, so he we go
function getType(invNum){
	//Now switch, turn it over now hit it!
	switch(invNum){
		case 0:
			return "Ammo";
		case 1:
			return "Head";
		case 2:
			return "Neck";
		case 3:
			return "Shoulder";
		case 4:
			return "Shirt";
		case 5:
			return "Chest";
		case 6:
			return "Waist";
		case 7:
			return "Legs";
		case 8:
			return "Feet";
		case 9:
			return "Wrist";
		case 10:
			return "Hands";
		case 11:
			return "Finger #1";
		case 12:
			return "Finger #2";
		case 13:
			return "Trinket #1";
		case 14:
			return "Trinket #2";
		case 15:
			return "Back";
		case 16:
			return "Main Hand";
		case 17:
			return "Off Hand";
		case 18:
			return "Ranged";
		case 19:
			return "Tabard";
		case 20:
			return "First Bag";
		case 21:
			return "Second Bag";
		case 22:
			return "Third Bag";
		case 23:
			return "Fourth Bag";
	}
}

//lets do some truncating - helps with decimals like 14.3242355
function truncateDec(number, digits){
	
	//figure out how many digits we are looking at
	var multiplier = Math.pow(10,digits);
	//get the adjusted number by multipling the multiplier with
	var adjustedNum= number * multiplier;
	//this is the number without those decimal places but huge
	var truncNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
	//return the final nume
	return truncNum/multiplier;
}

//reset the board
function resetAll(){
	
	//these are pretty straightforward see reset method for more info
	reset('strength');
	reset('agility');
	reset('intellect');
	reset('stamina');

	reset('damage');
	reset('speed');

	reset('manaRegen');

	reset('armor');
	reset('dodge');
	reset('parry');
	reset('block');

	reset('crit');
	reset('haste');
	reset('mastery');
	reset('leech');
	reset('versatility');

	//get the li items in the itemList ul
	var iL = document.getElementsByClassName("itemLi");
	//get the length
	var length = iL.length;
	//get the ul
	var itemHold = document.getElementById("itemList");
	//get rid of those children
	for(var i = 0; i<length; i++)
	{
		//remove all of the li elements
		itemHold.removeChild(iL[0]);	
	}
}

function reset(id){
	//reset the id's color and innerHTML
	document.getElementById(id).innerHTML = "--";
	document.getElementById(id).style.color = '#faefe8';
}