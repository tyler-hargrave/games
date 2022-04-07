//CACHE THE ELEMENTS
const $skillInput = $(".skillInput");
const $skillButton = $(".skillButton");
const $table = $("table");

//Start with empty table

//Look at localStorage
//localStorage.setItem("skills","[]")
let skills = localStorage.getItem("skills");
skills = JSON.parse(skills);

//Add a Skill
$skillButton.click(() => {
 let input = $skillInput.val();

 if (input !== "") {
  skills.push(input);

  $skillInput.val("");
  localStorage.setItem("skills", JSON.stringify(skills));
  console.log(skills);
  render();
 }
});

//Render
const render = () => {
 $table.html("");

 console.log(skills);
 skills.forEach((x) => {
  $table.append("<tr><td> X </td>        <td> " + x + "</td></tr>");
 });

 //Remove a skill
 let $removeButton = $("table tr td:first-child");
 $removeButton.click((e) => {
  let remove = $(e.target).next().html().trim();
  for (var i = 0; i < skills.length; i++) {
   console.log(remove);
   console.log(skills[i]);
   if (skills[i] === remove) {
    console.log(i);
    skills.splice(i, 1);
   }
  }
  console.log(skills);
  localStorage.setItem("skills", JSON.stringify(skills));
  render();
 });
};
render();
