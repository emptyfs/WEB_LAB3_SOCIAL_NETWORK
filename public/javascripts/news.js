$(document).ready(()=>{
    let length = $(`.table_avatar`).data("length");

    $(`.table_avatar`).css("background-color","white");
    $(`.table_avatar`).find('td').css("background-color","white");
    $(`.table_avatar`).find('th').css("background-color","white");
    $(`.left_user_form`).css("width", "150px");
    $(`.left_user_form`).css("display", "inline-block");

    for(let i = 0; i < length; i++)
    {
        let news = $(`p.${i+1}`).data("news");
        news = news.join('<br />');
        $(`p.${i+1}`).append(($(`<p>${news}</p>`)))
    }

    $(`.clear_news`).on("click", (event)=> {
        let index = $(event.target).data("index");
        let pic = $(event.target).data("pic");

        $(`p.${pic+1}`).remove();

        if (index+1)
        {
            $.ajax({
                url:`/news/${index}`,
                type: 'DELETE',
                data: {"index": index}
            });
        }
    });
});