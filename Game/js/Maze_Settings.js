var Maze, MazeGame;

const makeMaze = (id, width, height, speech = false) => {
  Maze = new FancyMazeBuilder(width, height);
  Maze.display(id);
  MazeGame = new Mazing("maze");
  if(speech) {
    MazeGame.enableSpeech();
  }
};

let difficulty = document.getElementById("diff")
makeMaze("maze_container", 10, 6);
difficulty.style.color = "green"
difficulty.addEventListener("change",function(e){
  if (difficulty.value == "ez"){
    difficulty.style.color = "green"
    makeMaze("maze_container", 10, 6);
  }else if (difficulty.value == "mid"){
    difficulty.style.color = "orange"
    makeMaze("maze_container", 14, 8);
  }else if (difficulty.value == "hd"){
    difficulty.style.color = "red"
    makeMaze("maze_container", 20, 12);
  }else if(difficulty.value == "damn"){
    difficulty.style.color = "rgb(83, 2, 2)"
    makeMaze("maze_container", 30, 15);
  }else{
    makeMaze("maze_container", 10, 6);
  }
  e.preventDefault()
})

