var users = [{"name": "Kevin", "url": "http://localhost"}];

var p = [];
for (var i = 0; i < users.length; i++) {
    p.push('<li><a href="');
    p.push(users[i].url);
    p.push('">');
    p.push(users[i].name);
    p.push('</a></li>');
}

// 最后 join 一下就可以得到最终拼接好的模板字符串
console.log(p.join('')) // <li><a href="http://localhost">Kevin</a></li>