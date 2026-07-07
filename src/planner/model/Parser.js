export class Parser {
    json;
    plan;
    readJSON(json) {
        this.json = json;
        console.log("json: " + json);
        this.plan = JSON.parse(json);
        console.log("plan: " + this.plan);
    }
    buildModel(planner2D) {
        // planner2D.clearBoard();
        if (this.plan)
            planner2D.buildModel(this.plan);
    }
    printJSON() {
        //console.log("this function right here");
        console.log(this.plan);
    }
}
