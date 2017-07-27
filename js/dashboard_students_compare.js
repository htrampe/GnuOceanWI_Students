cards = [];
quests = [];
medals = [];
chars = [];
datalist_char = [];
/* CHARAKTER */
//Load Chars
function loadChars(){

  db.allDocs({
      include_docs : true,
      attachments: true
    }).then(function (result) {
      for(i in result["rows"]){

        //Add Chars to table, cards/quests/medals to arrays
        if(result["rows"][i]['id'].includes("CARDS_"))
        {
          cards.push(result["rows"][i]);
        }
        else if(result["rows"][i]['id'].includes("QUEST_"))
        {
          quests.push(result["rows"][i]);
        }
        else if(result["rows"][i]['id'].includes("MEDALS_"))
        {
          medals.push(result["rows"][i]);
        }
        else if(result["rows"][i]['id'].includes("CHARS_")){                 
          chars.push(result["rows"][i]);  
          datalist_char.push(result["rows"][i]['doc']['charname']);        
        }       
      }
     
      //ADD CHAR DATA
      for(i in chars){       
        points = 0;
        //MEDALS
        for(k in chars[i]['doc']['medals']){          
          for(m in medals){
            if(medals[m]['id'] == chars[i]['doc']['medals'][k]){
              points += parseInt(medals[m]['doc']['medalpoints']);              
            }
          }
        }

        for(k in chars[i]['doc']['sudocards']){          
          for(m in cards){
            if(cards[m]['id'] == chars[i]['doc']['sudocards'][k]){
              points += parseInt(cards[m]['doc']['cardpoints']);  
            }
          }
        }
        

        //BONUNS
        bonus = 0;
        for(k in chars[i]['doc']['sudocards']){          
          for(m in cards){
            if(cards[m]['id'] == chars[i]['doc']['sudocards'][k]){
              if(parseInt(cards[m]['doc']['cardbonus']) > 0) bonus += parseInt(cards[m]['doc']['cardbonus']);    
              if(parseInt(cards[m]['doc']['cardpoints']) > 0) points += parseInt(cards[m]['doc']['cardpoints']);
            }
          }
        }

        //Recalculate Bonus and Points

        if(bonus > 0){
          points += points / 100 * bonus;
        }

        chars[i]["points"] = points;
        chars[i]["bonus"] = bonus;
      }

      if(localStorage['tempcharname'] != undefined && localStorage['tempcharname'].length > 0){
        $("#searchCharName").val(localStorage['tempcharname']);
        localStorage.removeItem("tempcharname");
        searchChar();
      }

      $( "#searchCharNameFir" ).autocomplete({
        source: datalist_char
      });
      $( "#searchCharNameSnd" ).autocomplete({
        source: datalist_char
      });


    });
}

function clearSnd(){
  $("#searchCharNameSnd").val("");
  $("#dashcontent").html("");
}

function clearFir(){
  $("#searchCharNameFir").val("");
  $("#dashcontent").html("");
}

function searchCharFir(){
  if($("#searchCharNameSnd").val().length > 1 && $("#searchCharNameFir").val().length > 1) searchChars()
}

function searchCharSnd(){
  if($("#searchCharNameSnd").val().length > 1 && $("#searchCharNameFir").val().length > 1) searchChars()
}

//Search-Function
function searchChars(){
  searchstring_first = $("#searchCharNameFir").val();
  searchstring_snd = $("#searchCharNameSnd").val();
  new_dashcontent = "";

  if(searchstring_first.length > 0 && searchstring_snd.length > 0){


    //Char found - show result in single-view
    for(i in chars){
      if(chars[i]['doc']['charname'].toUpperCase().includes(searchstring_first.toUpperCase())){

        new_dashcontent += '\
            <div style="float: left; margin: 5px; max-width: 45%" class="well">\
            <img src="data:image/jpg;base64,'+chars[i]['doc']['_attachments']['charfoto.png']['data']+'"\
             width="30%" style="float: left;"/>\
             <div style="float: right; margin-left: 5px; text-align: right" class="alert alert-info"><h2 style="margin-bottom: -20px"><u><strong>' + chars[i]['doc']['charname'] + '</strong></u></h2>\
             &nbsp;&nbsp;<h3><strong>'+ chars[i]["points"] +' Punkte</strong><br />'+chars[i]["bonus"]+'% Bonus<br />\
             '+chars[i]['doc']['quests'].length+' Quests<br />\
             '+chars[i]['doc']['medals'].length+' Orden<br />\
             '+chars[i]['doc']['sudocards'].length+' Sudocards</h3></div></div>';
      }
    }

    //Char found - show result in single-view
    for(i in chars){
      if(chars[i]['doc']['charname'].toUpperCase().includes(searchstring_snd.toUpperCase())){

        new_dashcontent += '\
            <div style="float: left; margin: 5px; max-width: 45%" class="well">\
            \
             <div style="float: left; margin-left: 5px;" class="alert alert-info"><h2 style="margin-bottom: -20px"><u><strong>' + chars[i]['doc']['charname'] + '</strong></u></h2>\
             &nbsp;&nbsp;<h3><strong>'+ chars[i]["points"] +' Punkte</strong><br />'+chars[i]["bonus"]+'% Bonus<br />\
             '+chars[i]['doc']['quests'].length+' Quests<br />\
             '+chars[i]['doc']['medals'].length+' Orden<br />\
             '+chars[i]['doc']['sudocards'].length+' Sudocards</h3>\
             </div><img src="data:image/jpg;base64,'+chars[i]['doc']['_attachments']['charfoto.png']['data']+'"\
             width="30%" style="float: right;"/>';
      }
    }

    $("#dashcontent").html(new_dashcontent);
  }
  else $("#dashcontent").html("");

}
