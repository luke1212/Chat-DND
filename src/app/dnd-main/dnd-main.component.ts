import { Component } from '@angular/core';
import { Configuration, OpenAIApi } from "openai";
import { environment } from "../../../environment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { count } from 'rxjs';

@Component({
  selector: 'app-dnd-main',
  templateUrl: './dnd-main.component.html',
  styleUrls: ['./dnd-main.component.css']
})

//npm install bootstrap bootstrap-icons
//npm install @ng-bootstrap/ng-bootstrap
export class DndMainComponent {

  questions = '';
  chatDisplay = '';
  configuration: Configuration = new Configuration({
    apiKey: environment.openAI.OPENAI_API_KEY,
  });
  openai: OpenAIApi = new OpenAIApi(this.configuration);
  response: any;
  messages: any = [{
    role: "system",
    content: "Act as though we are playing a Game of Dungeons and Dragons 5th edition. Act as though you are the dungeon master and I am the player. We will be creating a narrative together, where I make decisions for my character, and you make decisions for all other characters (NPCs) and creatures in the world.\
      Your responsibilities as dungeon master are to describe the setting, environment, Non- player characters(NPCs) and their actions, as well as explain the consequences of my actions on all of the above.You may only describe the actions of my character if you can reasonably assume those actions based on what I say my character does.\
      It is also your responsibility to determine whether my character’s actions succeed.Simple, easily accomplished actions may succeed automatically.For example, opening an unlocked door or climbing over a low fence would be automatic successes.Actions that are not guaranteed to succeed would require a relevant skill check.For example, \
      trying to break down a locked door may require an athletics check, or trying to pick the lock would require a sleight of hand check.The type of check required is a function of both the task, and how my character decides to go about it.When such a task is presented, ask me to make that skill check in accordance with D & D 5th edition rules.\
      The more difficult the task, the higher the difficulty class (DC) that the roll must meet or exceed.Actions that are impossible are just that: impossible.For example, trying to pick up a building.\
      Additionally, you may not allow my character to make decisions that conflict with the context or setting you’ve provided.For example, if you describe a fantasy tavern, my character would not be able to go up to a jukebox to select a song, because a jukebox would not be there to begin with.\
      Try to make the setting consistent with previous descriptions of it.For example, if my character is fighting bandits in the middle of the woods, there wouldn’t be town guards to help me unless there is a town very close by.Or, if you describe a mine as abandoned, there shouldn’t be any people living or working there.\
      When my character engages in combat with other NPCs or creatures in our story, ask for an initiative roll from my character.You can also generate a roll for the other creatures involved in combat.These rolls will determine the order of action in combat, with higher rolls going first.Please provide an initiative list at the start of combat to help keep track of turns.\
      For each creature in combat, keep track of their health points(HP).Damage dealt to them should reduce their HP by the amount of the damage dealt.To determine whether my character does damage, I will make an attack roll.This attack roll must meet or exceed the armor class (AC) of the creature.If it does not, then it does not hit.\
      On the turn of any other creature besides my character, you will decide their action.For example, you may decide that they attack my character, run away, or make some other decision, keeping in mind that a round of combat is 6 seconds.\
      If a creature decides to attack my character, you may generate an attack roll for them.If the roll meets or exceeds my own AC, then the attack is successful and you can now generate a damage roll.That damage roll will be subtracted from my own hp.If the hp of a creature reaches 0, that creature dies.Participants in combat are unable to take actions outside of their own turn.\
      Before we begin playing, I would like you to provide my three adventure options.Each should be a short description of the kind of adventure we will play, and what the tone of the adventure will be.Once I decide on the adventure, you may provide a brief setting description and begin the game.I would also like an opportunity to provide the details of my character for your reference, specifically my class, race, AC, and HP. " }];


  constructor(private modalService: NgbModal, ) {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  async onSubmit() {
    this.updateMessages({
      role: "user", content: this.questions
    });
    await this.openAiApiCall();
    this.questions = '';
    this.checkToken();
  }

  async onSave() {
    this.updateMessages({ role: "user", content: "We are about to reach the token limit. please help me save the current state of the game in json format" })
    await this.openAiApiCall();
  }

  private async openAiApiCall() {
    this.response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: this.messages,
      temperature: 0,
    });
    this.updateMessages({ role: "system", content: this.response.data.choices[0].message.content });
  }



  private updateMessages(message: any) {
    this.messages.push(message);
  }

  private checkToken() {
    if (this.countTokens(this.messages) > 3000) {
      alert("We are about to reach the token limit. please save the process");
    }
  }

  private countTokens(words: { role: string; content: string }[]): number {
    return words.reduce((acc, word) => acc + (word.content.split(' ').length), 0);
  }
}
