(function() {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("DOM chargé !");
        
        const content = document.getElementById('conteneur');
        if (!content) {
            console.error("Erreur : conteneur non trouvé !");
            return;
        }

        let trees = [];
        const growthTime = 1000;
        const growthFactor = 1.2;

        // Ajouter un arbre lorsqu'on clique
        content.addEventListener('click', function(event) { 
            let tree = document.createElement('div');
            tree.className = 'tree';

            // Positionner l'arbre dans le conteneur
            const rect = content.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            let treeRadius = 20;
            tree.style.left = `${x}px`;
            tree.style.top = `${y}px`;
            tree.style.width = `${treeRadius * 2}px`;
            tree.style.height = `${treeRadius * 2}px`;

            content.appendChild(tree);
            trees.push(tree);

            console.log("Nouvel arbre ajouté :", trees.length, "arbres au total");

            // Croissance automatique de l'arbre
            setInterval(() => {
                if (tree.parentNode) {
                    tree.style.width = `${parseInt(tree.style.width) * growthFactor}px`;
                    tree.style.height = `${parseInt(tree.style.height) * growthFactor}px`;
                }
            }, growthTime);

            // Mettre à jour les graphiques
            updateCharts(trees);
        });
    });
})();
