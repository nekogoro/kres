$(function() {
    var type_id;
    var item_id;

    $.getJSON('data/equipments_tree.json', function(data) {
        for(var i=0; i<data.length; i++) {
            $('#select-type').append('<option value="'+i+'">'+data[i].type+'</option>');
        }
    });

    $('#select-type').change(function() {
        $('#select-item').empty();
        $('#select-item').append('<option value="-1">選択してください</option>');
        type_id = $(this).val();
        $.getJSON('data/equipments_tree.json', function(data) {
            for(var i=0; i<data[type_id].item.length; i++){
                $('#select-item').append('<option value="'+i+'">'+data[type_id].item[i].name+'</option>');
            }
        });
    });

    $('#select-item').change(function() {
        item_id = $(this).val();
        $('#equipment-table tbody').empty();
        $.getJSON('data/equipments_tree.json', function(data) {
            $('#output').text(data[type_id].item[item_id].name);
            for(var i=0; i<data[type_id].item[item_id].required.length; i++){
                var required_name = data[type_id].item[item_id].required[i].name;
                var required_export = data[type_id].item[item_id].required[i].export;
                var required_id = 'required-' + i;
                $('#equipment-table tbody').append('<tr class="required" id="'+required_id+'"></tr>')
                $('#'+required_id).append(
                    '<td><a href="https://wikiwiki.jp/kancolle/'+required_name+'" target="_blank">'+required_name+'</td>'
                    +'<td><select id="star"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">MAX</option><option value="11">更新</option></td>'
                    +'<td class="amount0">'+data[type_id].item[item_id].required[i].amount[0]+'</td>'
                    +'<td class="amount1">'+data[type_id].item[item_id].required[i].amount[1]+'</td>'
                    +'<td class="amount2">'+data[type_id].item[item_id].required[i].amount[2]+'</td>'
                    +'<td><input name="amount" id="amount-'+i+'" value="0"></input></td>'
                    +'<td><a href="https://wikiwiki.jp/kancolle/'+required_export+'" target="_blank">'+required_export+'</td>'
                    +'<td><input name="num" type="number" min="0" max="100" value="0"></input></td>');
            }
            $('#equipment-table tbody').append('<tr><td colspan="7">合計必要数</td><td id="sum"></td></tr>')
        });
    });

    $('body').on('change', 'select', function() {
        $('tr.required').each(function(i) {
            var star = $(this).find('#star').val();
            var amount = 0;
            if (star == 11) {
                amount = parseInt($(this).find('.amount2').html()) + parseInt($(this).find('.amount1').html()) * 4 + parseInt($(this).find('.amount0').html()) * 6;
            } else if (star > 6) {
                amount = parseInt($(this).find('.amount1').html()) * (star - 6) + parseInt($(this).find('.amount0').html()) * 6;
            } else {
                amount = parseInt($(this).find('.amount0').html()) * star;
            }
            $('#amount-'+i).val(amount);
       });
    });

    $('body').on('change', 'input[type="number"]', function() {
        var sum = 0;
        $('tr.required').each(function(i, val) {
            var amount = $(this).find('input[name="amount"]').val();
            var num = $(this).find("input[name='num']").val();
            sum += amount * num;
       });
       $('#sum').text(sum.toString());
    });
});