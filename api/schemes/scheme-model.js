const db = require("../../data/db-config");

async function find() {

const allDatas = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc");
  return allDatas;
}
async function findById(scheme_id) {
  const filteredData = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.scheme_name", "st.*")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");

    if (filteredData.length == 0) {
    return null;
  }

  let responseData = {
    scheme_id: parseInt(scheme_id),
    scheme_name: filteredData[0].scheme_name,
    steps: []
  }
  if (!filteredData[0].step_id)
    return responseData;

  for (let i = 0; i < filteredData.length; i++) {
    const item = filteredData[i];
    let stepModel = {
      step_id: item.step_id,
      step_number: item.step_number,
      instructions: item.instructions
    }
    responseData.steps.push(stepModel);
  }
  return responseData;
}

function findSteps(scheme_id) {
  const steps = db("steps as st")
    .leftJoin("schemes as sc", "st.scheme_id", "sc.scheme_id")
    .select("st.step_id", "st.step_number", "st.instructions", "sc.scheme_name")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");
  return steps;
}
async function add(scheme) {
   let [scheme_id] = await db("schemes").insert(scheme);
  return findById(scheme_id);
}
async function addStep(scheme_id, step) {
  step.scheme_id = scheme_id;
  await db("steps").insert(step);
  return findSteps(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};