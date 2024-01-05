$(document).ready(function() {
    const cont = $('.cont');
    const hamburger = $('#hamburger');

    const toggleDisplay = () => cont.toggleClass('open');

    hamburger.on('click', toggleDisplay);

    // Event delegation for delete button click
    $('.dir').on('click', '.delete-btn', function() {
        const boxName = $(this).closest('.box').text();

        if (confirm(`Are you sure you want to delete the box "${boxName}"?`)) {
            // Remove the box from the container
            $(this).closest('.box').remove();

            // Remove the box name from localStorage
            const boxNames = JSON.parse(localStorage.getItem('boxNames')) || [];
            const updatedBoxNames = boxNames.filter(name => name !== boxName);
            localStorage.setItem('boxNames', JSON.stringify(updatedBoxNames));

            console.log(`Box "${boxName}" deleted from localStorage. Remaining boxes:`, updatedBoxNames);
        }
    });


    $('.dir').on('click', '.box', function() {
        const boxName = $(this).text();
        
        // Redirect to another page
        window.location.href = '/notes1'; // Replace 'your_destination_page.html' with the actual page URL
    });

    // Function to clone default box style
    function cloneDefaultBoxStyle() {
        const sampleBox = $('.dir .box').first();
        const newBox = sampleBox.clone(true, true);
        return newBox;
    }

    // Function to update UI based on local storage
    function updateUIFromLocalStorage() {
        // Retrieve and display saved boxes on page load
        const boxNames = JSON.parse(localStorage.getItem('boxNames')) || [];

        // Clear existing boxes in the UI, excluding the default 4 boxes
        $('.dir .box').not(':lt(4)').remove();

        boxNames.forEach(function(boxName) {
            const savedBox = cloneDefaultBoxStyle();
            savedBox.text(boxName);

            // Add delete button to the existing box
            const deleteButton = $('<button>', {
                text: 'Delete',
                class: 'delete-btn'
            });

            savedBox.append(deleteButton);

            $('.dir').append(savedBox);
        });
    }

    // Call the function to update UI on page load
    updateUIFromLocalStorage();

    $('#pl').on('click', function() {
        const newName = prompt('Enter the name for the new box:');

        if (newName) {
            // Clone the style of an existing box
            const newBox = cloneDefaultBoxStyle();
            newBox.text(newName);

            // Add delete button to the new box
            const deleteButton = $('<button>', {
                text: 'Delete',
                class: 'delete-btn'
            });

            newBox.append(deleteButton);

            // Append the new box to the container
            $('.dir').append(newBox);

            // Save the new box name to localStorage
            const boxNames = JSON.parse(localStorage.getItem('boxNames')) || [];
            boxNames.push(newName);
            localStorage.setItem('boxNames', JSON.stringify(boxNames));

            console.log(`Box "${newName}" added to localStorage. Updated boxes:`, boxNames);
        }
    });
});
