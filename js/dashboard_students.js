cards = [];
quests = [];
medals = [];
chars = [];


/* CHARAKTER */
//Load Chars
function loadChars(){
  db.allDocs({
      include_docs : true,
      attachments: true
    }).then(function (result) {
      dashcontent = '  <table class="table table-striped" id="chartable">\
    <thead>\
      <tr>\
        <th>Name</th>\
        <th>Klasse</th>\
        <th>Punkte</th>\
        <th>Coins</th>\
        <th>Bonus</th>\
        <th>Quests</th>\
        <th>Orden</th>\
        <th>Sudocards</th>\
      </tr>\
    </thead>\
    <tbody>';

      counter = 0;
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
          dashcontent += '<tr onclick="viewSingle(\''+result["rows"][i]['doc']['charname']+'\')">\
          <td>'+result["rows"][i]['doc']['charname']+'</td>\
          <td>'+result["rows"][i]['doc']['charclass']+'</td>\
          <td><span id="char_'+result["rows"][i]['id']+'_pointssum">0</span></td>\
          <td>'+result["rows"][i]['doc']['coins']+'</td>\
          <td><span id="char_'+result["rows"][i]['id']+'_bonisum">0</span></td>\
          <td>'+result["rows"][i]['doc']['quests'].length+'</td>\
          <td>'+result["rows"][i]['doc']['medals'].length+'</td>\
          <td>'+result["rows"][i]['doc']['sudocards'].length+'</td>\
          </tr>';
          counter++;         
        }       
      }
      dashcontent += '</tbody></table>';
      $("#dashcontent").html(dashcontent);
      $("#char_count").html(counter);
      
      points = 0;
        
      //ADD CHAR DATA
      for(i in chars){       
        //MEDALS
        for(k in chars[i]['doc']['medals']){          
          for(m in medals){
            if(medals[m]['id'] == chars[i]['doc']['medals'][k]){
              points += parseInt(medals[m]['doc']['medalpoints']);              
            }
          }
        }
       //MEDALS
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

        $("#char_" + chars[i]['id'] + "_pointssum").html(points);
        $("#char_" + chars[i]['id'] + "_bonisum").html(bonus);
      }

      $('#chartable').DataTable();
      $("#char_count").html(chars.length);
    });
}

//LOAD SINGLE VIEW
function viewSingle(charname){
  localStorage["tempcharname"] = charname;
  window.location.href = "gnuocean_students_single.html";
}
