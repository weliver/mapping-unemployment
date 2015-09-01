$(document).ready(function() {
  $('#year').focus();
  d3Map.year = $('#year').val();
  d3Map.drawMap(d3Map.year);
  $('#data-year').text(d3Map.year);
  $('#year').on('input', function() {
    d3Map.year = $(this).val();
    $('#data-year').text(d3Map.year);
    d3Map.drawMap($(this).val());
  })

});

