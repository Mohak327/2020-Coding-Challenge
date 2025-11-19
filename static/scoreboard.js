function display_scoreboard(scoreboard, animate){
  if(animate){
    reorder_scoreboard(scoreboard);
  } else {
    $("#teams").empty();
    $.each(scoreboard, function(index, team){
      addTeamView(team.id, team.name, team.score);
    });
  }
}

function reorder_scoreboard(scoreboard){
  var $teams = $("#teams");
  var $children = $teams.children();
  
  var oldPositions = {};
  $children.each(function(){
    var $this = $(this);
    var id = $this.data('team-id');
    oldPositions[id] = $this.position().top;
  });
  
  $children.each(function(){
    var $this = $(this);
    var id = $this.data('team-id');
    var team = scoreboard.find(function(t){ return t.id === id; });
    if(team){
      $this.find('.col-md-2').first().text(team.score);
    }
  });
  
  var items = $children.detach().get();
  items.sort(function(a, b){
    var aId = $(a).data('team-id');
    var bId = $(b).data('team-id');
    var aIdx = scoreboard.findIndex(function(t){ return t.id === aId; });
    var bIdx = scoreboard.findIndex(function(t){ return t.id === bId; });
    return aIdx - bIdx;
  });
  
  $.each(items, function(i, item){
    $teams.append(item);
  });
  
  $teams.children().each(function(){
    var $this = $(this);
    var id = $this.data('team-id');
    var oldTop = oldPositions[id];
    var newTop = $this.position().top;
    var distance = oldTop - newTop;
    
    if(distance !== 0){
      $this.css({
        'position': 'relative',
        'top': distance + 'px'
      });
      $this.animate({
        top: 0
      }, 500, function(){
        $this.css('position', '');
      });
    }
  });
}

function addTeamView(id, name, score){
  var team_template = $("<div class = 'row team-row'></div>");
  team_template.data('team-id', id);
  var name_template = $("<div class = col-md-5></div>");
  var score_template = $("<div class = col-md-2></div>");
  var button_template = $("<div class = col-md-2></div>");
  var increase_button = $("<button class = increase-button>+</button>");
  $(increase_button).click(function(){
    increase_score(id);
  });
  name_template.text(name);
  score_template.text(score);
  button_template.append(increase_button);
  team_template.append(name_template);
  team_template.append(score_template);
  team_template.append(button_template);
  $("#teams").append(team_template);
}

function increase_score(id){
  var team_id = {"id": id}
  $.ajax({
    type: "POST",
    url: "increase_score",                
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(team_id),
    success: function(result){
        scoreboard = result.scoreboard;
        scoreboard.sort(function(a, b) {
          return b.score - a.score;
        });
        display_scoreboard(scoreboard, true);
    },
    error: function(request, status, error){
        console.log("Error");
        console.log(request)
        console.log(status)
        console.log(error)
    }
  });
}

$(document).ready(function(){
  display_scoreboard(scoreboard);
})
