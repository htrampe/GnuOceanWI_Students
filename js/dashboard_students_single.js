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

      /*for(t in datalist_char){
         var option = document.createElement('option');
         option.value = datalist_char[t];
         $("#characters").append(option);
         //console.log(datalist_char);
      } */
      
      $( "#searchCharName" ).autocomplete({
        source: datalist_char
      });


    });
}

function clearInput(){
  $("#searchCharName").val("");
  $("#dashcontent").html("");
}

//Search-Function
function searchChar(){
  searchstring = $("#searchCharName").val();
  new_dashcontent = "";


  if(searchstring.length > 1){


    //Char found - show result in single-view
    for(i in chars){
      if(chars[i]['doc']['charname'].toUpperCase().includes(searchstring.toUpperCase()))
      {

        //QUESTS
        final_quests = "";
        for(k in chars[i]['doc']['quests']){
          for(m in quests){
            if(quests[m]['id'] == chars[i]['doc']['quests'][k]){
              questdesc_limit = quests[m]['doc']["questdesc"].substring(0, 30) + "...";
              final_quests += "<h4>" + quests[m]['doc']["questname"] + "&nbsp;("+quests[m]['doc']["questcoins"]+" Coins)</h4>" + questdesc_limit
            }
          }
        }

        //Medals
        final_medals = "";
        for(k in chars[i]['doc']['medals']){
          for(m in medals){
            if(medals[m]['id'] == chars[i]['doc']['medals'][k]){              
              final_medals += '<h4><img src="data:image/jpg;base64,'+medals[m]['doc']['_attachments']['medal.png']['data']+'"\
             width="15%" style="float: left; margin-right: 5px"/>' + medals[m]['doc']["medalname"] + "&nbsp;("+medals[m]['doc']["medalpoints"]+" Punkte)</h4>" + medals[m]['doc']["medaldesc"]
            }
          }
        }

        //Sudocards
        final_cards = "";
        for(k in chars[i]['doc']['sudocards']){
          for(m in cards){
            if(cards[m]['id'] == chars[i]['doc']['sudocards'][k]){
              if(cards[m]['doc']["cardpoints"].length == 0) points = 0;
              else points = cards[m]['doc']["cardpoints"];

              if(cards[m]['doc']["cardbonus"].length == 0) bonus = 0;
              else bonus = cards[m]['doc']["cardbonus"];
              final_cards += '<h4><img src="data:image/jpg;base64,'+cards[m]['doc']['_attachments']['cardfoto.png']['data']+'"\
             width="15%" style="float: left; margin-right: 5px"/>' + cards[m]['doc']["cardname"] + "&nbsp;("+points+" Punkte / "+bonus+"% Bonus)</h4>" + cards[m]['doc']["carddesc"]
            }
          }
        }

        new_dashcontent = '\
            <div style="float: left; margin: 10px" class="well">\
            <img src="data:image/jpg;base64,'+chars[i]['doc']['_attachments']['charfoto.png']['data']+'"\
             width="43%" style="float: left;"/>\
             <div style="float: left; margin-left: 10px; min-width: 45%" class="alert alert-info"><h2 style="margin-bottom: -20px"><u><strong>' + chars[i]['doc']['charname'] + '</strong></u></h2>\
             &nbsp;&nbsp;<h3><strong>'+ chars[i]["points"] +' Punkte</strong><br />'+chars[i]["bonus"]+'% Bonus<br />\
             '+chars[i]['doc']['quests'].length+' Quests<br />\
             '+chars[i]['doc']['medals'].length+' Orden<br />\
             '+chars[i]['doc']['sudocards'].length+' Sudocards</h3>\
             </h3></div></div><div style="float: left" style="float: left"><hr>\
             <div class="well" style="float: left; margin: 10px"><h2>Abgeschlossene Quests</h2>' + final_quests + 
             '</div><div class="well" style="float: left; margin: 10px"><h2>Erhaltene Orden</h2>' + final_medals + 
             '</div><div class="well" style="float: left; margin: 10px"><h2>Sudocards</h2>' + final_cards + "</div></div>";

        $("#dashcontent").html(new_dashcontent);

      }
    }
  }

  if(new_dashcontent.length == 0) $("#dashcontent").html(new_dashcontent);

}
