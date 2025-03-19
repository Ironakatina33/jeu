document.addEventListener('DOMContentLoaded', (event) => {
    let compteur = 0;
    const compteurElement = document.getElementById('compteur');
    const content = document.getElementById('conteneur');
    const removeTreesButton = document.getElementById('removeTreesButton');
    const treeTypeButtons = document.querySelectorAll('.treeTypeButton');
    const type2Button = document.getElementById('type2Button');
    const type3Button = document.getElementById('type3Button');
    const time = 3000;
    let treeCount = 0;
    let removeMode = false;
    let selectedTreeType = null;

    const treePrices = {
        type1: 0,
        type2: 20,
        type3: 40
    };

    // Initialiser les prix des boutons au chargement de la page
    updateAllButtonTexts();
    updateButtonStates();

    // Activer le mode de suppression lorsqu'on clique sur le bouton
    removeTreesButton.addEventListener('click', function() {
        removeMode = true;
        selectedTreeType = null;
        content.removeEventListener('click', handleContentClick);
    });

    // Sélectionner le type d'arbre lorsqu'on clique sur un bouton de type d'arbre
    treeTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedTreeType = this.getAttribute('data-tree-type');
            removeMode = false;
            content.addEventListener('click', handleContentClick);
        });
    });

    // Gérer le clic dans le conteneur pour ajouter un arbre
    function handleContentClick(event) {
        if (selectedTreeType && event.target === content) {
            const treePrice = treePrices[selectedTreeType];
            if (compteur >= treePrice) {
                compteur -= treePrice;
                compteurElement.textContent = compteur;
                addTree(event.clientX, event.clientY, selectedTreeType);
                increasePrice(selectedTreeType);
                updateButtonStates();
                if (selectedTreeType === 'type1') {
                    type2Button.style.display = 'block';
                }
                if (selectedTreeType === 'type2') {
                    type3Button.style.display = 'block';
                }
            } else {
                alert("Vous n'avez pas assez de pièces pour acheter cet arbre.");
            }
        }
    }

    // Ajouter un arbre
    function addTree(x, y, treeType) {
        const tree = document.createElement('div');
        tree.className = `tree ${treeType}`;
        treeCount++;

        const rect = content.getBoundingClientRect();
        const treeX = x - rect.left + 20;
        const treeY = y - rect.top + 20;

        const treeRadius = 20;
        tree.style.left = treeX - treeRadius + 'px';
        tree.style.top = treeY - treeRadius + 'px';

        tree.style.width = treeRadius * 2 + 'px';
        tree.style.height = treeRadius * 2 + 'px';

        content.appendChild(tree);

        let growCount = 0;
        const growInterval = setInterval(() => {
            if (growCount < 3) {
                growTree(tree);
                growCount++;
            } else {
                clearInterval(growInterval);
                setTimeout(() => {
                    tree.style.backgroundColor = 'brown';
                    tree.isBrown = true; // Marquer l'arbre comme marron
                    clearInterval(tree.coinInterval); // Arrêter l'intervalle qui ajoute des pièces
                }, 10000); // Attendre 10 secondes après la fin de la croissance
            }
        }, time);

        checkCollisions(tree);

        const coinInterval = setInterval(() => {
            if (!tree.isBrown) {
                compteur++;
                compteurElement.textContent = compteur;
                updateButtonStates();
            }
        }, 2000);

        tree.coinInterval = coinInterval;

        tree.addEventListener('click', function(event) {
            if (removeMode) {
                clearInterval(tree.coinInterval);
                if (tree.isBrown) {
                    addCoins(treeType);
                }
                tree.remove();
                updateButtonStates();
            } else {
                tree.classList.toggle('selected');
            }
            event.stopPropagation();
        });
    }

    // Ajouter des pièces en fonction du type d'arbre détruit
    function addCoins(treeType) {
        let coins = 0;
        switch (treeType) {
            case 'type1':
                coins = 10;
                break;
            case 'type2':
                coins = 20;
                break;
            case 'type3':
                coins = 40;
                break;
        }
        compteur += coins;
        compteurElement.textContent = compteur;
        updateButtonStates();
    }

    // Faire grandir l'arbre
    function growTree(tree) {
        const growFactor = 1.2;
        tree.style.width = parseInt(tree.style.width) * growFactor + 'px';
        tree.style.height = parseInt(tree.style.height) * growFactor + 'px';

        checkCollisions(tree);
    }

    // Vérifier les collisions
    function checkCollisions(tree) {
        const trees = document.querySelectorAll('.tree');
        trees.forEach(otherTree => {
            if (otherTree !== tree && isColliding(tree, otherTree)) {
                clearInterval(otherTree.coinInterval);
                otherTree.remove();
            }
        });
    }

    // Vérifier si deux arbres sont en collision
    function isColliding(tree1, tree2) {
        const rect1 = tree1.getBoundingClientRect();
        const rect2 = tree2.getBoundingClientRect();
        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }

    // Augmenter le prix de l'arbre de 20% et mettre à jour le texte du bouton
    function increasePrice(treeType) {
        treePrices[treeType] = Math.round(treePrices[treeType] * 1.20);
        updateButtonText(treeType);
    }

    // Mettre à jour le texte du bouton avec le nouveau prix
    function updateButtonText(treeType) {
        const button = document.querySelector(`.treeTypeButton[data-tree-type="${treeType}"]`);
        let buttonText = '';
        const price = treePrices[treeType];
        button.setAttribute('data-price', price);
        switch (treeType) {
            case 'type1':
                buttonText = `Ajouter un arbre vert (Gratuit)`;
                break;
            case 'type2':
                buttonText = `Ajouter un arbre rouge (${price} pièces)`;
                break;
            case 'type3':
                buttonText = `Ajouter un arbre bleu (${price} pièces)`;
                break;
        }
        button.textContent = buttonText;
    }

    // Mettre à jour le texte de tous les boutons avec les prix actuels
    function updateAllButtonTexts() {
        updateButtonText('type1');
        updateButtonText('type2');
        updateButtonText('type3');
    }

    // Mettre à jour l'état des boutons en fonction du nombre de pièces
    function updateButtonStates() {
        treeTypeButtons.forEach(button => {
            const treeType = button.getAttribute('data-tree-type');
            const price = treePrices[treeType];
            if (compteur >= price) {
                button.classList.remove('disabled');
            } else {
                button.classList.add('disabled');
            }
        });
    }
});