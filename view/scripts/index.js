
$.get("/scrape", function(data){
  loadResults(data);
})

  function loadResults(results){
    for(let i = 0; i < 5; i++){
      let li = $('<li>');
      let summary = results[i].summary || "No Summary Available"
      li.html(`<button class="article" data-link="${results[i].link}" data-summary="${summary}">${results[i].headline}</button>`);
      $('#headlines').prepend(li);
    }
  }

  function loadComments(comments){
    $('#saved-comments').empty();
    for(let i = 0; i < comments.length; i++){
      let li = $('<li>');
      let commentText = `${comments[i].user}: ${comments[i].comment}`
      li.text(commentText);
      $('#saved-comments').append(li);
    }
  }

  function fetchComments(headline){
    $.post("/findcomments", {headline:headline}).done(function(data){
      loadComments(data);
    })
  }

  function addComment(title, comment, user){
    $.post("/add", {headline:title, username:user, userComment:comment});
  }

  $('#scraper').on('click', function(){
    $.get("/scrape", function(data){
      loadResults(data);
    })
  })

  $(document).on('click', '.article', function(){
    let link = $(this).attr('data-link');
    let summary = $(this).attr('data-summary');
    let headline = $(this).text();
    let a = $('<a>');
    let p = $('<p>');
    a.attr('href', link);
    a.attr('class', 'summary');
    a.attr('target', '_blank');
    a.text(summary);
    a.append(' <i class="fa fa-external-link" aria-hidden="true"></i>');
    p.append(a)
    $('.summary-area').html(p);
    $('#add-comment').attr('data-headline', headline);
    fetchComments(headline);
    $('.comments').css('display', 'block');
  })

  $('#add-comment').on('click', function(){
    let comment = $('#user-comment').val().trim();
    let username = $('#username').val().trim();
    let headline = $('#add-comment').attr('data-headline');
    let li = $('<li>')
    li.text(`${username}: ${comment}`);
    addComment(headline, comment, username);
    $('#saved-comments').append(li);
    $('#user-comment').val('');
    $('#username').val('');
  })
