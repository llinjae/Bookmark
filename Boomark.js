const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');



let bookmarks = {};

function showModal() {
    // show-modal class를 추가해주면서 name 쪽에 커서가 바로 가도록 
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// 클릭하면 showModal 실행
    modalShow.addEventListener('click', showModal);
    // 클릭하면 show-modal 클래스 제거하면서 modal이 닫히도록
    modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
    // target이 modal임면 show-modal 클래스를 없애고 아니면 아무것도 안하겠다!!!
    window.addEventListener('click', e => (e.target === modal ? modal.classList.remove('show-modal') : false))



function validate(nameValue, urlValue) {
    // google에 regex url 치면 나옴!!
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!nameValue || !urlValue) {
        alert('두 항목 모두 작성해주세요.')
        return false;
    }

    if (!urlValue.match(regex)) {
        alert('유효한 URL이 아닙니다.');
        return false;
    }
    // 두 if문에 충족하지 않으면 true
    return true;
}

// 북마크 DOM을 만들어줘
function buildBookmarks() {
    // 북마크를 추가했으면 그 요소들을 다 지워야함. 그래야 또 새로운걸 추가 가능함.
    // bookmarksContainer.textContent = '';
    // forEach를 사용하려면 배열로 만들어줘야함
    Object.keys(bookmarks).forEach((id) => {
        // 객체나 배열에 저장된 데이터 전체가 아닌 일부만 필요한 경우가 생기기도 함. 이럴 때 구조 분해할당 사용(destructuring)
        // 객체나 배열을 변수로 '분해’할 수 있게
        const { name, url } = bookmarks[id];

        // 목록 만들어줌
        const item = document.createElement('div');
        item.classList.add('item');
        
        // 닫는 아이콘에 대한거
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`);

        // link와 favicon container 만들어줌
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // 만들어주는 목록마다 favicon 추가해줌
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // bookmark container에 append해주기
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });

}




function fetchBookmarks() {
    // 북마크를 로컬 스토리지에서 얻어와야함
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // 로컬스토리지에 북마크 목록을 만들어줘야함
        // 밑에꺼는 그냥 샘플로 해두는거임
        const id = `http://velog.io/@dldlswognqh`
        bookmarks[id] = {
            name: 'velog',
            url: 'http://velog.io/@dldlswognqh',
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}


function deleteBookmark(id) {
    // 북마크가 존재하면 삭제한다.
    if (bookmarks[id]) {
        delete bookmarks[id]
    }
    // 북마크 목록을 로컬스토리지에 업데이트 해줘야함.
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}


function storeBookmark(e) {
    // 제출 누르고 새로고침 방지
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    // urlValue에 http나 https가 포함되어있지 않다면 https:// 추가해줌
    if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
    urlValue = `https://${urlValue}`;
}
    // 만약 validate에서 true가 나오면 이 과정은 건너뛰어도 된다는 거
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks[urlValue] = bookmark;
    // localStorage.setItem('bookmarks', bookmarks); 이렇게만 작성하면 
    // 그냥 [object, Object]라고만 뜸...
    // 그래서 JSON을 문자열화해줘야함...
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    //setitem을 해주고 난 뒤에 fetchBookmarks를 실행해줌
    fetchBookmarks();
    // 제출하면 reset 시켜주고, name 인풋창에 focus
    bookmarkForm.reset();
    websiteNameEl.focus();

}


// bookmarkForm에서 제출을 누르면 storeBookmark함수가 실행
bookmarkForm.addEventListener('submit', storeBookmark);

// 페이지로 돌아올 때 로컬스토리지에 있던 것을 가져와서 북마크 목록에 채울 수 있도록
fetchBookmarks();


// 세션 스토리지는 웹페이지의 세션이 끝날 때 저장된 데이터가 지워지는 반면에, 로컬 스토리지는 웹페이지의 세션이 끝나더라도 데이터가 지워지지 않습니다.
// 로컬 스토리지의 경우 여러 탭이나 창 간에 데이터가 서로 공유되며 탭이나 창을 닫아도 데이터는 브라우저에 그대로 남아 있습니다.
