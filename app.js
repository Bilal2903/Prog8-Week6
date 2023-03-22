import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

// DATA
const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignored = ["class"]

let edibleMushrooms = 0;
let poisonousMushrooms = 0;
let predictedEdibleMushrooms = 0;
let predictedPoisonousMushrooms = 0;

// laad csv data als json
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

// MACHINE LEARNING - Decision Tree
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5));

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    let json = decisionTree.toJSON()
    let jsonString = JSON.stringify(json)
    console.log(jsonString)

    // accuracy(data, decisionTree)

    // todo : maak een prediction met een sample uit de testdata

    let mushroom = testData[0]
    let mushroomPrediction = decisionTree.predict(mushroom)
    console.log(`You have survived the holiday : ${mushroomPrediction}`)

    // todo : bereken de accuracy met behulp van alle test data

    function accuracy(data, tree, label) {
        let correct = 0;
        for (let row of data) {
            if (row.class === tree.predict(row)) {
                correct++;
            }
        }

        let element = document.getElementById('accuracy');
        element.innerText = `Accuracy: ${correct / data.length}`;
        console.log(`Accuracy ${label} data: ${correct / data.length}`)
    }

    accuracy(trainData, decisionTree, "train");
    accuracy(testData, decisionTree, "test");

    for(const row of data){
        if(row.class === "e" && decisionTree.predict(row) === "e") {
            edibleMushrooms++
        }
        else if (row.class === "e" && decisionTree.predict(row) === "p") {
            predictedEdibleMushrooms++
        }
        else if (row.class === "p" && decisionTree.predict(row) === "e"){
            predictedPoisonousMushrooms++
        }
        else if (row.class === "p" && decisionTree.predict(row) === "p"){
            poisonousMushrooms++
        }
    }

    let tableEdibleMushrooms = document.getElementById('edibleMushrooms');
    tableEdibleMushrooms.innerText = edibleMushrooms.toString();

    let tablePredictedPoisonousMushrooms = document.getElementById('predictedPoisonousMushrooms');
    tablePredictedPoisonousMushrooms.innerText = predictedPoisonousMushrooms.toString();

    let tablePredictedEdibleMushrooms = document.getElementById('predictedEdibleMushrooms');
    tablePredictedEdibleMushrooms.innerText = predictedEdibleMushrooms.toString();

    let tablePoisonousMushrooms = document.getElementById('poisonousMushrooms');
    tablePoisonousMushrooms.innerText = poisonousMushrooms.toString();

}

loadData()