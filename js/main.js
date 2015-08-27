$(document).ready(function() {
  year = $('#year').val();
  drawMap(year);
  $('#data-year').text(year);
  $(document).keydown(function(e){
  	var key = event.which;
  	if ((event.which === 37) && (year >1975)) {
  		year--;
  		$('#year').val(year);
	    changeYear();
  	} else if ((event.which === 39) && (year < 2013)){
  		year++;
  		$('#year').val(year);
    	changeYear();
  	}
  });
  $('#year').on('change', function(e){
  	year = $(this).val();
    changeYear();
  });
  function changeYear(el) {
    drawMap(year);
    $('#data-year').text(year);
  }
});