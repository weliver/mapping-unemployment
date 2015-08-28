$(document).ready(function() {
  $('#year').focus();
  year = $('#year').val();
  drawMap(year);
  $('#data-year').text(year);
  $('#year').on('input change', function() {
    year = $(this).val();
    $('#data-year').text(year);
    drawMap($(this).val());
  })
  function changeYear(x) {
    drawMap(x);
  }
});

