import Game from "./Game";

export default class RunPlayer {
  run() {
    const animation = Game.getInstance().player.animation;

    if (!animation) return;
    animation.forEach((anim) => {
      if (anim.name === "idle" || anim.name === "attack") {
        anim.stop();
      } else if (anim.name === "running") {
        anim.play(true);
      }
    });
  }
}
