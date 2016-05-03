$(document).ready(function() {
  document.CR_N = 3;
  document.HannahKay = 2;
  //*****************************************************
  //создали матрицу 30х30, заполненную -1, чтобы записывать в нее значения из фирм
  //*****************************************************
  mas = [];
  masResult = [];
  for (i = 0; i < window.industrys; i++){
    mas[i] = [];
    masResult[i] = [];
    for (j = 0; j < window.firms; j++){
      mas[i][j] = null;
      masResult[i][j] = null;
    }
  }

  
  //****************************************************
  // Записываем данные из таблички о фирмах при нажатии клавиш в input.firm
  //*****************************************************
  $( ".firm" ).keyup(function() {
    val = $(this).val();
    if(val == null || val.length < 1 ) {
      mas[$(this).attr("col")][$(this).attr("row")] = null;
    } 
    else {
      mas[$(this).attr("col")][$(this).attr("row")] = $(this).val()*1;
    }
    masResult = SetSimResult(mas,masResult);
    SetTableData(masResult);
  });
  
  //*****************************************************
  // Действия при изменении коэффициентов CR и Hannah-Kay 
  //*****************************************************
  $( ".CRInput" ).keyup(function() { // CR N
    val = $(this).val();
    if(val != null || val*1 >0 ) {
      document.CR_N = val*1;
      GetSolution(masResult,mas);
    } 
  });
  $( ".HannahInput" ).keyup(function() { // CR N
    val = $(this).val();
    if(val != null || val*1 >0 ) {
      document.HannahKay = val*1;
      GetSolution(masResult,mas);
    } 
  });
  
  

  
  //*****************************************************
  // Находим данные для таблички "Результаты симуляции"
  //*****************************************************
  function SetSimResult(MasIn,MasOut) {
    for(i=0;i<MasIn.length; i++) {
      summ = null;
      for(j=0;j<MasIn[i].length; j++) {
        if( MasIn[i][j]*1 > 0 ) {
          summ += MasIn[i][j];
        }
      }
      summ /= 100;
      
      for(j=0;j<MasIn[i].length; j++) {
        if( MasIn[i][j] > 0 ) {
          MasOut[i][j] = MasIn[i][j]/summ;
        }
        else {
          MasOut[i][j] = null;
        }
      }
    }
    return MasOut;
  }
  
  
  //*****************************************************
  // Записываем результаты симуляции в табличку
  //*****************************************************
  function SetTableData(MasIn) {
    for(i=0;i<window.firms;i++) {
      for(j=0;j<window.industrys;j++) {
        if(MasIn[j][i]) {
          $(".FirmResultCol"+j+"_Row"+i).val((MasIn[j][i]).toFixed(3));
        }
        else {
          $(".FirmResultCol"+j+"_Row"+i).val("");
        }
      }
    }
    PlotSearchPoint(masResult); // <--------------------------------------------------Рисуем график
    PlotSearchPointLorenc(masResult); // <--------------------------------------------------Рисуем график
    GetSolution(masResult,mas); // <------------------------------------------------------Находим коэффициенты
  }
  
  
  //*****************************************************
  // Рисуем график
  //*****************************************************
  function Plot(ObjSeries){

    $(function () {    
      $('#ConcentrationCurves').highcharts({
          chart: { type: 'spline' },
          title: { text: 'Concentration Curves'  },
          xAxis: { type: 'number',title: { text: 'Продажи' } },
          yAxis: { title: { text: 'Snow depth (m)' }, min: 0 },
          tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
          },
          plotOptions: { spline: { marker: { enabled: true } } },
          series: ObjSeries
      });
    });
  }
  
  
  //*********************************************************
  // Находим точки для Cumulative market share
  //*********************************************************
  function PlotSearchPoint(masResult) {         // посылаем строки с координатами на создание конечного объекта
    length = []; // сколько компаний в индустрии
    for(indus=0;indus<window.industrys;indus++) {
      for(comp=0;comp<window.firms;comp++){
        if(masResult[indus][comp]>0) {
          length[indus]=comp+1;
        } else {comp = 100;}
      }
    }
    str = '[';
    for(i=0;i<window.industrys;i++) {
      str += GetStrKoord(i,masResult,length);
    }
    str += ']';
    ObjSeries = eval(str);
    Plot(ObjSeries);    
  } 
  function GetStrKoord(i,masResult,length) {    // делаем строку с координатами
    if(length[i]>1){
      k = i+1;
      str = '{name: "Индустрия '+k+'", data:['; 
      sum = 0;
      str += '[0, 0],';
      for(j=0;j<length[i];j++) {
        sum += masResult[i][j]*1000;
        jj= j+1;
        str += '['+jj+', '+sum+'],';
      }
      str += ']},'; 
      return str;
    }
    else {
      return '';
    }
  }
  

  //*********************************************************
  // Находим точки для Lorenc curves
  //*********************************************************
  function PlotSearchPointLorenc(masResult) { // посылаем строки с координатами на создание конечного объекта
    length = []; // сколько компаний в индустрии
    for(indus=0;indus<window.industrys;indus++) {
      for(comp=0;comp<window.firms;comp++){
        if(masResult[indus][comp]>0) {
          length[indus]=comp+1;
        } else {comp = 100;}
      }
    }
    str = '[{name: "Опорная", data:[[0, 0],[100, 100]]},';
    for(i=0;i<window.industrys;i++) {
      str += GetStrKoordLorenc(i,masResult,length);
    }
    if(str == '[{name: "Опорная", data:[[0, 0],[100, 100]]},') {
      $(".img").addClass("opacity");
      $(".img").removeClass("opacity1");
    } else{
      $(".img").addClass("opacity1");
      $(".img").removeClass("opacity");
    }
    str += ']';
    ObjSeries = eval(str);
    PlotLorenc(ObjSeries);    
  }
  function GetStrKoordLorenc(i,masResult,length) { // делаем строку с координатами
    if(length[i]>1){
      k = i+1;
      str = '{name: "Индустрия '+k+'", data:['; 
      sum = 0;
      str += '[0, 0],';
      step_one = 100/length[i];
      for(j=0;j<length[i];j++) {
        sum += masResult[i][j];
        str += '['+(step_one*(j+1))+', '+sum+'],';
      }
      str += ']},'; 
      $(".img").removeClass("opacity0")
      return str;
    }
    else {
      return '';
    }
  }
  function PlotLorenc(ObjSeries){
    $(function () {    
      $('#LorenzCurves').highcharts({
          chart: { type: 'spline' },
          title: { text: 'Lorenc Сurves'  },
          xAxis: { type: 'number',title: { text: '' } },
          yAxis: { title: { text: '' }, min: 0 },
          tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
          },
          plotOptions: { spline: { marker: { enabled: true } } },
          series: ObjSeries
      });
    });
  }
  

  //*********************************************************
  // Вычисление коэффициентов
  //*********************************************************
  function GetSolution(masResult,masSource){
    coeffic = [];
    // 0 - CR3
    // 1 - CR4
    // 2 - Hirschman-Herfindahl
    // 3 - Hannah-Kay
    
    for (i = 0; i < window.industrys; i++){
      coeffic[i] = [];
      for (j = 0; j < window.firms; j++){
        coeffic[i][j] = null;
      }
    }
    // ------ 3 firm (CR3) ------- = 0
    coeffic = CR_N(masResult,coeffic, document.CR_N);
    // ------- 4 firm (CR4) ------- = 1
    for(i=0;i<window.industrys;i++){
      summ = null;
      for(j=0;j<4;j++){
        if( masResult[i][j] > 0 ) {
          summ += masResult[i][j]; 
        }
      }
      coeffic[i][1] = summ; 
    }
    
    // -- Hirschman-Herfindahl -- = 2
    for(i=0;i<window.industrys;i++){
      summ = null;
      for(j=0;j<window.firms;j++){
        if( masResult[i][j] ) {
          summ += masResult[i][j]*masResult[i][j]; 
        }
      }
      if(summ){
        coeffic[i][2] = summ/10000; 
      }
    }
    
    // -- Hannah-Kay (NE) a=2 -- = 3
    coeffic = HannahKay(masResult, coeffic, 3, document.HannahKay);
    // -- Rosenbluth hall--- = 4
    for(i=0;i<window.industrys;i++){ 
      sum = null;
      sum_all = 0;
      for(k=0;k<window.firms;k++){ // находим общее сумму товаров
        if( masSource[i][k] > 0 ) {
          sum_all += masSource[i][k];
        }
      }
      for(k=0;k<window.firms;k++){ 
        if( masSource[i][k] > 0 ) {
          sum += (masSource[i][k]/sum_all)*(k+1);
        }
      }
      if(sum){
        coeffic[i][4] = 1/(sum*2-1);
      }
    }
    
    // ------ Entropy ----- =5
    for(i=0;i<window.industrys;i++){ 
      sum = null;
      sum_all = 0;
      for(k=0;k<window.firms;k++){ // находим общее сумму товаров
        if( masSource[i][k]) {
          sum_all += masSource[i][k];
        }
      }
      for(k=0;k<window.firms;k++){ 
        if( masSource[i][k] ) {
          x = masSource[i][k]/sum_all;
          sum += x*(Math.log(x)/Math.log(2));
        }
      }
     if(sum){ 
      coeffic[i][5] = -sum;
     }
    }
    
    // ------ Variance of logs ----- =6
    for(i=0;i<window.industrys;i++){ 
      sum = null;
      sum_all = 0;
      sumA = 0;
      sumB = 0;
      for(k=0;k<window.firms;k++){ // находим общее сумму товаров
        if( masSource[i][k] > 0 ) {
          sum_all += masSource[i][k];
        }
      }
      for(k=0;k<window.firms;k++){ 
        if( masSource[i][k] > 0 ) {
          sumA += Math.pow( Math.log( masSource[i][k]/sum_all ),2 );
          sumB += Math.log( masSource[i][k]/sum_all );
          n = k + 1;
        }
      }
      if(sumA){
        coeffic[i][6] = (1/n)*sumA-(1/(n*n))*sumB*sumB;
      }
    }
    
    // ------ Gini coefficient ----- =7
    for(i=0;i<window.industrys;i++){ 
      for(k=0;k<window.firms;k++){ // находим N
        if( masSource[i][k] > 0 ) {
          n = k + 1;
        }
      }
      coeffic[i][7] = 1-1/(n*coeffic[i][4]);
    }
    SetTable("Coeff",coeffic);
    return coeffic;
    
  }
  
  function SetTable(Pref,MasIn){
    for(i=0;i<8;i++) {
      for(j=0;j<window.industrys;j++) {
        if(MasIn[j][i]) {
          $("#"+Pref+"_Col"+j+"_Row"+i).val((MasIn[j][i]).toFixed(3));
        }
        else {
          $("#"+Pref+"_Col"+j+"_Row"+i).val("");
        }
      }
    }
  }
  
  
  function CR_N(masResult,coeffic,N){
    for(i=0;i<window.industrys;i++){
      summ = null;
      for(j=0;j<N;j++){
        if( masResult[i][j] > 0 ) {
          summ += masResult[i][j]; 
        }
      }
      coeffic[i][0] = summ;
    }
    return coeffic;
  }

  function HannahKay(masResult, coeffic, PositionInTable, N){
    for(i=0;i<window.industrys;i++){
      summ = null;
      for(j=0;j<window.firms;j++){
        if( masResult[i][j] ) {
          summ += Math.pow(masResult[i][j],N); 
        }
      }
      if(summ){
        coeffic[i][PositionInTable] = summ/10000;
      }
    }
    return coeffic;
  }
  
$("#FontFamily").click(function() {
  tmp = '<style> body *{ font-family:';
  tmp += $("#FontFamily").val();
  tmp += ' !important;}</style>';
  $( "#del_font_family" ).html(tmp);
});
$("#FontSize").click(function() {
  tmp = '<style> body *{ font-size:';
  tmp += $("#FontSize").val();
  tmp += 'px !important;}</style>';
  $( "#del_font_size" ).html(tmp);
});
  
});  
  
