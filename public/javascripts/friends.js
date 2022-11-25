$(document).ready(()=> {
    $(`.delete_from_friends`).on("click", (event)=>{
        let index = $(event.target).data("index");
        let self_index = $(event.target).data("self_index");

        if (index || self_index)
        {
            $.ajax({
                url:`/friends/${index}`,
                type: 'DELETE',
                data: {"index": index, "self_index": self_index},
                success:  function () {
                    location.reload();
                }
            });
        }
    });

    $(`.add_to_friends`).on("click", (event)=>
    {
        let index = $(event.target).data("index");
        let self_index = $(event.target).data("self_index");

        if (index || self_index)
        {
            $.ajax({
                url:`/friends/${index}`,
                type: 'PUT',
                data: {"index": index, "self_index": self_index},
                success:  function () {
                    location.reload();
                }
            });
        }
    });
});