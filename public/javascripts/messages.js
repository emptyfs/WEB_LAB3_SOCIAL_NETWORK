$(document).ready(()=> {
    let length = $(`.table_avatar`).data("length");

    $(`.table_avatar`).css("background-color", "white");
    $(`.table_avatar`).find('td').css("background-color", "white");
    $(`.table_avatar`).find('th').css("background-color", "white");
    $(`.left_user_form`).css("width", "150px");
    $(`.left_user_form`).css("display", "inline-block");

    var self_index;

    for(let i = 0; i < length; i++)
    {
        if ($(`p.${i+1}`).data("messages"))
        {
            let messages = $(`p.${i+1}`).data("messages");
            messages = messages.join('<br />');
            $(`p.${i+1}`).append(($(`<p>${messages}</p>`)))
        }
        else
        {
            self_index = i;
        }
    }

    $(`.send_message`).on("click", (event)=> {
        let index = $(event.target).data("index");
        let text;

        $(`input[type="text"].${index+1}`).each(function () {
            text = $(this).val();
        });

        if (text)
        {
            $.ajax({
                url:`/messages/${self_index}`,
                type: 'PUT',
                data: {"index": index, "text": text},
                success: location.reload()
            });
        }
    });
});