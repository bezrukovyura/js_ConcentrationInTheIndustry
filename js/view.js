////////////////////////////////// Таблица для заполнения


function PaintTableSource(y,x) {
  ScreenOut = '';
  for(i=0;i<x;i++) {
    ScreenOut += '<tr>';
    for(j=0;j<y;j++) {
      if(i == 0) {
        ScreenOut += '<td>Инд.'+(j+1)+' </td>';
      }
    }
    ScreenOut += '</tr><tr>';
    for(j=0;j<y;j++) {
      ScreenOut += '<td><input col="'+j+'" row="'+i+'" class="firm col'+j+' row'+i+'" id="Col'+j+'_Row'+i+'" /></td>';
    }
    ScreenOut += '</tr>';
  }
  return ScreenOut;
}

////////////////////////////////// Таблица для графика 
function PaintTableGraph(y,x) {
  ScreenOut = '';
  for(i=0;i<x;i++) {
    ScreenOut += '<tr>';
    for(j=0;j<y;j++) {
      if(i == 0) {
        ScreenOut += '<td>Инд.'+(j+1)+' </td>';
      }
    }
    ScreenOut += '</tr><tr>';
    for(j=0;j<y;j++) {
      ScreenOut += '<td><input class="FirmResult FirmResultCol'+j+'_Row'+i+'" id="Col'+j+'_Row'+i+'" type="number" /></td>';
    }
    ScreenOut += '</tr>';
  }
  return ScreenOut;
}

/////////////////////////////////// Таблица с коэффициентами
function PaintTableCoeff(y,x) {
  var CoeffName = [0,'CR<input class="CRInput" value="3">',
                   'Hirshman-herfindahl',
                   'Hannah-Kay a=<input class="HannahInput" value="2">',
                   'Rosenbluth/Hall-Tideman',
                   'Entropy',
                   'Variance of logs',
                   'Gini coefficient']
  ScreenOut = '';
  for(i=0;i<7;i++) {
    ScreenOut += '<tr>';
    if(i == 0) {
      ScreenOut += '<td></td>';
      for(j=0;j<y;j++) {
        ScreenOut += '<td>Инд.'+(j+1)+' </td>';
      }
    }
    ScreenOut += '</tr><tr>';
    for(j=0;j<y;j++) {
      if( j == 0) {
        ScreenOut += '<td>'+CoeffName[i+1]+'</td>';
      }
      ScreenOut += '<td><input col="'+j+'" row="'+i+'" class="coefficents" id="Coeff_Col'+j+'_Row'+i+'" type="number" /></td>';
    }
    ScreenOut += '</tr>';
  }
  return ScreenOut;
}


//////////////////////////////////// Вывод трех таблиц при определении количества индустрий и фирм
function PaintTable(industrys, firms) {
  tmp = PaintTableSource(firms,industrys);
  $( "#TableSource" ).html(tmp);
  
  tmp = PaintTableGraph(firms,industrys);
  $( "#TableGraph" ).html(tmp);
  
  tmp = PaintTableCoeff(firms,industrys);
  $( "#TableCoeff" ).html(tmp);
  
}

function linking(){
  x = $( "#industrys" ).val();
  y = $( "#firms" ).val();
  location.href='#x='+x+";y="+y;
  window.location.reload();
}
$(document).ready(function() {
  x=null; y=null;
  eval(location.hash.substring(1));
  if(!y || !x) {
    $( ".tables" ).remove();
  } else {
    window.industrys = x;
    window.firms = y;
  }
  PaintTable(y, x);
});