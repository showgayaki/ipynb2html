function ipynb2Html(ipynbData, targetId){
    // いらないタグ削除
    shapedHtml = ipynbData.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    // 空白コードを半角スペースに変更
    shapedHtml = shapedHtml.replace(/&nbsp;/g, ' ');

    const ipynbDataJson = JSON.parse(shapedHtml);
    let cell = '';
    for(let i = 0; i < ipynbDataJson['cells'].length; i++){
        let input = '';
        let output = '';

        const executionCount = ipynbDataJson['cells'][i]['execution_count'];
        const source = ipynbDataJson['cells'][i]['source'];
        const cellType = ipynbDataJson['cells'][i]['cell_type'];

        input += shapeInputs(source, cellType, executionCount);
        if(ipynbDataJson['cells'][i]['outputs'] && ipynbDataJson['cells'][i]['outputs'].length > 0){
            output += shapeOutputs(ipynbDataJson['cells'][i]['outputs'], executionCount);
        }
        cell += input + output;
    }
    $(targetId).empty();
    $(targetId).append(cell);
    $(targetId).addClass('ipynb-cells');
    // デフォルトスタイル削除
    $('.output-code div style').remove();
    $('.output-code div table').removeAttr('border class');
}


function shapeInputs(source, cellType, executionCount){
    let cell = '<div class="input-row">\n';
    cell += '<div class="input-prompt">\n';
    // markdown以外なら、実行回数挿入
    cell += (cellType !== 'markdown') ? 'In [' + executionCount + ']:</div>\n' : '</div>\n';
    cell += '<div class="input-' + cellType + '">\n';
    for(let i = 0; i < source.length; i++){
        if(cellType === 'markdown'){
            // markdown記法箇所抜き出し
            const mark = source[i].split(' ')[0]
            if(mark.indexOf('#') !== -1){
                // hタグ
                const hash = source[i].match(/\#+\s*/g)[0];
                const hashTrimmed = hash.trim();
                cell += '<h' + hashTrimmed.length + '>' + source[i].replace(hash, '') + '</h' + hashTrimmed.length + '>\n';
            }else if(mark === '*'){
                // ul開始タグ
                if(i === 0 || source[i - 1].split(' ')[0].indexOf('*') === -1){
                    cell += '<ul>\n'
                }
                cell += '<li>' + source[i].replace(/\*\s*/g, '').replace('\n', '') + '</li>\n';

                // ul終了タグ
                if((i === source.length - 1) || (source[i + 1].split(' ')[0].indexOf('*') === -1)){
                    cell += '</ul>\n';
                }
            }else if(source[i] !== '\n'){
                cell += '<p>' + source[i].replace(/&lt;/g, '<').replace(/&gt;/g, '>') +'</p>\n';
            }
        }else if(cellType === 'code'){
            cell += (i === 0) ? '<pre><code class="python">' : '';
            cell += source[i];
            cell += (i === source.length - 1) ? '</code></pre>\n' : '';
        }
    }
    cell += '</div>\n</div>\n';
    return cell;
}


function shapeOutputs(outputs, executionCount){
    let output = '<div class="output-row">\n';
    output += '<div class="output-prompt">\nOut [' + executionCount + ']:</div>';
    output += '<div class="output-code">\n';
    for(let i = 0; i < outputs.length; i++){
        if(outputs[i]['text']){
            output += '<pre>\n';
            for(let j = 0; j < outputs[i]['text'].length; j++){
                output += outputs[i]['text'][j];
            }
            output += '</pre>\n';
        }

        if(outputs[i]['data']){
            if(outputs[i]['data']['text/html']){
                for(let j = 0; j < outputs[i]['data']['text/html'].length; j++){
                    output += outputs[i]['data']['text/html'][j];
                }
                output = output.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            }else if(outputs[i]['data']['text/plain']){
                output += '<pre>\n';
                for(let j = 0; j < outputs[i]['data']['text/plain'].length; j++){
                    output += outputs[i]['data']['text/plain'][j];
                }
                output += '</pre>\n';
            }

            if(outputs[i]['data']['image/png']){
                output += '<img src="data:image/png;base64,' + outputs[i]['data']['image/png'] + '">';
            }
        }
    }
    output += '</div>\n</div>\n';
    return output;
}
