
const content = document.getElementById('conteneur'); // récupérer l'élément content

const time = 1000; // temps en ms

// ajouter un arbre lorsqu'on clique
content.addEventListener('click', function(event) { 
    tree = document.createElement('div'); // créer un élément div
    tree.className = 'tree'; // ajouter la classe 'ball' à l'élément div

    // UPDATE POSTION
    // offset due to container position
    const computedStyle = getComputedStyle(content);
    x = event.clientX - parseInt(computedStyle.left);
    y = event.clientY - parseInt(computedStyle.top);
 
    treeRadius = 20;
    tree.style.left = x  + 'px';
    tree.style.top = y + 'px';

    // UPDATE SIZE
    tree.style.width = treeRadius * 2 + 'px';
    tree.style.height = treeRadius * 2 + 'px';


    content.appendChild(tree); // ajouter l'élément div à l'élément container

    // lance sa croissance
    setInterval(() => growTree(tree), time);

});   

function growTree(tree){
    // update size
    const growFactor = 1.2;
    tree.style.width = parseInt(tree.style.width) * growFactor + 'px';
    tree.style.height = parseInt(tree.style.height) * growFactor + 'px';
    // update timer
    setInterval(() => growTree(tree), time);
}

    
    