export class Recipe {
  constructor(
    public recipeName: string,
    public uploaderUid: string,
    public difficulty: string,
    public description: string,
    public ingredients: string[],
    public tools: string[],
    public images: string[],
    public instructions: string[],
    public extraInfo: string,
    public timestamp: number,
    public ratings: Object,
    public tags: string[],
    public baseRecipeId: string | undefined,
    public baseUploaderUid: string, 
    public averageRating: number,
  ) {
    this.recipeName = recipeName;
    this.uploaderUid = uploaderUid;
    this.difficulty = difficulty;
    this.description = description;
    this.ingredients = ingredients;
    this.tools = tools;
    this.images = images;
    this.instructions = instructions;
    this.extraInfo = extraInfo;
    this.timestamp = timestamp;
    this.ratings = ratings;
    this.tags = tags;
    this.baseRecipeId = baseRecipeId;
    this.baseUploaderUid = baseUploaderUid;
    this.averageRating = averageRating;
  }
}
