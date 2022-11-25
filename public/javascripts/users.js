$(document).ready(()=>{
    $(".edit_btn").on("click", (event)=>{

        let index = $(event.target).data("index");
        let arr_td = $(`.${index+1}`).find("td");
        for (let i = 0; i < arr_td.length; i++)
        {
            arr_td[i].hidden = !arr_td[i].hidden;
        }

        $(`.${index+1}`).find('table').css("background-color","white");
        $(`.${index+1}`).find('td').css("background-color","white");
        $(`.${index+1}`).find('th').css("background-color","white");

        $(`.birthday.${index+1}`).datepicker();

        let text =  $(`.edit_btn.${index+1}`);
        if (text.text() === "Сохранить данные")
        {
            text.text("Редактировать данные");
            let name;
            let email;
            let date;
            let role;
            let status;

            let image;
            let form_data_image

            $(`input[type="text"].name.${index+1}`).each(function () {
                 name = $(this).val();
            });

            $(`input[type="email"].email.${index+1}`).each(function () {
                email = $(this).val();
            });

            $(`input[type="datepicker"].birthday.${index+1}`).each(function () {
                date = $(this).val();
            });

            role = $(`.role.${index+1}`).val();

            status = $(`.status.${index+1}`).val();

            image = $(`input[type="file"].change_avatar.${index+1}`).prop('files')[0];
            form_data_image = new FormData();
            form_data_image.append('image', image);

            if(name)
            {
                $.ajax({
                    url: '',
                    type: 'PUT',
                    data: {"name": name, "index": index}
                });

                $(`.${index+1}`).find(".name_x").text(name);
                $(`input[type="text"].name.${index+1}`).each(function () {
                    $(this).attr("placeholder", name);
                });
            }

            if(email)
            {
                $.ajax({
                    url: '',
                    type: 'PUT',
                    data: {"email": email, "index": index}
                });

                $(`.${index+1}`).find(".email_x").text(email);
                $(`input[type="email"].email.${index+1}`).each(function () {
                    $(this).attr("placeholder", email);
                });
            }

            if(date)
            {
                $.ajax({
                    url:'',
                    type: 'PUT',
                    data: {"birthday": date, "index": index}
                });

                $(`.${index+1}`).find(".birthday_x").text(date);
                $(`input[type="datepicker"].birthday.${index+1}`).each(function () {
                    $(this).attr("placeholder", date);
                });
            }

            if (role)
            {
                $.ajax({
                    url:'',
                    type: 'PUT',
                    data: {"role": role, "index": index}
                });

                $(`.${index+1}`).find(".role_x").text(role);
            }

            if(status)
            {
                $.ajax({
                    url:'',
                    type: 'PUT',
                    data: {"status": status, "index": index}
                });

                $(`.${index+1}`).find(".status_x").text(status);
            }

            if(image)
            {
                $.ajax({
                    url: '/upload',
                    dataType: 'text',
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data_image,
                    type: 'POST',
                    success:  function () {
                        $.ajax({
                            url: '/upload',
                            type: 'PUT',
                            data: {"index": index},
                            success: function (){
                                d = new Date();
                                $(`.avatar.${index + 1}`).attr("src", `./images/${index}.jpg?`+d.getTime());
                            }
                        });
                    }
                });
            }
        }

        else
        {
            text.text("Сохранить данные");
        }
    });

    $("#add_user").on("click", (event)=>{
        $("#add_user_form")[0].hidden = !$("#add_user_form")[0].hidden;

        $(`#add_birtday`).datepicker();

        let text =  $(`#add_user`);
        if (text.text() === "Сохранить пользователя")
        {
            text.text("Добавить пользователя");

            let name;
            let email;
            let date;
            let role;
            let status;

            let index;

            let image;
            let form_data_image

            name = $("#add_name").val();

            email = $("#add_email").val();

            date = $("#add_birtday").val();

            role = $(`#add_role`).val();

            status = $(`#add_status`).val();

            image = $(`input[type="file"]#add_image`).prop('files')[0];
            form_data_image = new FormData();
            form_data_image.append('image', image);

            if(name && email && date && role && status && image)
            {
                $.ajax({
                    url: '',
                    type: 'POST',
                    data: {"name": name, "email": email, "birthday": date, "role": role, "status": status},
                }).done((data)=>{
                    index = data.fromserver;

                    $.ajax({
                        url: '/upload',
                        dataType: 'text',
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: form_data_image,
                        type: 'POST',
                        success:  function () {
                            location.reload();
                            $.ajax({
                                url: '/upload',
                                type: 'PUT',
                                data: {"index": index},
                                success: function (){
                                    d = new Date();
                                    $(`.avatar.${index + 1}`).attr("src", `./images/${index}.jpg?`+d.getTime());
                                }
                            });
                        }
                    });
                });



            }
            else
            {
                alert("Нужно заполнить все поля формы");
            }
        }
        else
        {
            text.text("Сохранить пользователя");
        }
    });

    $(".delete_btn").on("click", (event)=>{
        let index = $(event.target).data("index");

        $( `.table_avatar.${index+100}` ).remove();
        $( `.edit_btn.${index+1}` ).remove();
        $( `.delete_btn.${index+1}` ).remove();
        $( `.br.${index+1}` ).remove();
        $(`.friends.${index+1}`).remove();
        $(`.news.${index+1}`).remove();
        $(`.messages${index+1}`).remove();

        $.ajax({
            url:'',
            type: 'DELETE',
            data: {"index": index}
        });
    });
});