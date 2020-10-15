# ipynb2html
[gist-it.appspot.com](https://gist-it.appspot.com/)で取得したipynbコードをJupyter Notebook風にする。

## 使用ライブラリ
- [jQuery](https://jquery.com/)
- [highlight.js](https://highlightjs.org/)

## sample
```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ipynb2html_sample</title>
    <link rel="stylesheet" href="css/ipynb2html.css">
    <link rel="stylesheet" href="css/vendor/xcode.css">
    <script src="js/vendor/prettify.js"></script>
</head>
<body>
    <div id="ipynb-cells">
        <script src="https://gist-it.appspot.com/https://github.com/showgayaki/ipynb2html/blob/master/sample.ipynb"></script>
    </div>
    <script src="js/vendor/jquery-3.5.1.slim.min.js"></script>
    <script src="js/ipynb2html.js"></script>
    <script>
        const gistData = $('.gist-data').html();
        ipynb2Html(gistData, '#ipynb-cells');
    </script>
    <script src="js/vendor/highlight.pack.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
</body>
</html>
```

## 対応済みmarkdown
- \# : 見出し
- \*, \- : リスト
- ** ** : 太字
- _ _ : イタリック
-[]() : リンク
