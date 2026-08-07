export interface BattleStoryParagraph {
  id: string;
  title: string;
  text: string;
}

export interface BattleStoryData {
  headline: string;
  introduction: string;
  paragraphs: BattleStoryParagraph[];
  ending: string;
}
