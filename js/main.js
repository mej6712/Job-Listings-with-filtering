// 선택한 roles, levels, languages, tools를 저장하는 빈 배열을 담은 빈 객체를 만든다.
let selected = { roles: [], levels: [], languages: [], tools: [] };
// 불러올 리스트를 저장하는 빈 배열을 만든다.
let offers = [];

const main = document.querySelector(".job-list");
const filterBox = document.querySelector(".filter-list");

// fetch
// "./data.json" 경로의 파일을 fetch로 불러온다.
fetch("./data.json")
  // 프로미스가 이행했을 때 결과값을 res로 저장하고 json() 형태로 변환한다.
  .then((res) => res.json())
  // 위에서 json 형태로 변환한 데이터를 data라는 파라미터로 전달한다.
  .then((data) => {
    // 블러올 리스트를 저장하는 배열에 data를 선언한다.
    offers = data;
    // offers를 forEach로 createItems의 파라미터로 전달한 후 반복문을 돌린다.
    offers.forEach((offers) => {
      createItems(offers);
    });
  });

// 아이템 리스트를 만드는 함수
const createItems = ({
  // data로 전달받은 json 목록의 키 값을 아래의 파라미터 변수로 저장한다.
  company,
  logo,
  isNew,
  featured,
  position,
  role,
  level,
  postedAt,
  contract,
  location,
  languages,
  tools,
}) => {
  // 새로운 아이템이 들어갈 li를 만든다.
  const newLi = document.createElement("li");

  // mainItems라는 html 마크업을 만든다.
  const mainItems = `
    <div class="item-box ${featured ? "featured" : ""} clearfix">
      <div class="item-images">
        <img src="${logo}" alt="${company}" />
      </div>
      <div class="item-info">
        <div class="item-sub-info">
          <span class="company-title">${company}</span>
          ${isNew ? `<span class="new">NEW!</span>` : ""}
          ${featured ? `<span class="featured">FEATURED</span>` : ""}
        </div>
        <h1>${position}</h1>
        <ul class="clearfix">
          <li>${postedAt}</li>
          <li>${contract}</li>
          <li>${location}</li>
        </ul>
      </div>
      <div class="item-button">
        <ul>
          <li>
            <button data-filter="role">${role}</button>
          </li>
          <li>
            <button data-filter="level">${level}</button>
          </li>
          ${languages
            .map((items) => {
              return `<li><button data-filter="language">${items}</button></li>`;
            })
            // .join()을 붙이는 이유는 배열을 map 함수로 반복문을 돌리면 , 가 생기는데 그것을 없애준다.
            .join("")}
            ${tools
              .map((items) => {
                return `<li><button data-filter="tools">${items}</button></li>`;
              })
              .join("")}
        <ul>
      </div>
    </div>
  `;
  // 새로만든 li에 mainItems html 마크업을 넣는다.
  newLi.innerHTML = mainItems;
  // .jobList에 해당 li를 집어넣는다.
  main.appendChild(newLi);

  // 새로만든 li안에 data-filter가 role인 dom을 선택해서 addEventListener로
  // addToSelected라는 함수를 실행시키게하고 파라미터로 roles와 role값을 전달한다.
  const roleButton = newLi.querySelector("[data-filter=role]");
  roleButton.addEventListener("click", function () {
    addToSelected("roles", role);
  });

  // 새로만든 li안에 data-filter가 level인 dom을 선택해서 addEventListener로
  // addToSelected라는 함수를 실행시키게하고 파라미터로 levels와 level값을 전달한다.
  const levelButton = newLi.querySelector("[data-filter=level]");
  levelButton.addEventListener("click", function () {
    addToSelected("levels", level);
  });

  // 새로만든 li안에 data-filter가 language인 모든 dom을 선택한 뒤 forEach 반복문으로
  // 모든 dom에 addEventListener로 addToSelected라는 함수를 실행시키게하고
  // 파라미터로 languages와 해당 함수에 event 파라미터를 넣어 해당 dom의 innerHTML 값을 전달한다.
  const languageButton = newLi.querySelectorAll("[data-filter=language]");
  languageButton.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      addToSelected("languages", e.target.innerHTML);
    });
  });

  // 새로만든 li안에 data-filter가 tools인 모든 dom을 선택한 뒤 forEach 반복문으로
  // 모든 dom에 addEventListener로 addToSelected라는 함수를 실행시키게하고
  // 파라미터로 tools와 해당 함수에 event 파라미터를 넣어 해당 dom의 innerHTML 값을 전달한다.
  const toolButtons = newLi.querySelectorAll("[data-filter=tools]");
  toolButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      addToSelected("tools", e.target.innerHTML);
    });
  });
};

// addToSelected 함수에 group과 value라는 파라미터값을 설정하고
// 만약 selected 객체에 group이라는 키에 해당 value값이 없다면 selected 객체의 group 키의 값에 value값을 추가한다.
// 그리고 filterSelected()와 redrawOffers() 함수를 실행시킨다.
const addToSelected = (group, value) => {
  if (!selected[group].includes(value)) {
    selected[group].push(value);
  }

  filterSelected();
  redrawOffers();
};

const filterSelected = () => {
  // filterBox 안의 HTML을 모두 초기화 시킨다.
  filterBox.innerHTML = "";
  // filter 리스트를 설정할 li를 새로 만든다.
  const filter = document.createElement("li");
  const createFilterElements = () => {
    // element라는 변수를 만들어서 초기화 시킨다.
    let element = "";
    // Object.entries로 selected 객체의 key값과 value값을 for of 문으로 반복문을 돌린다.
    for (const [key, value] of Object.entries(selected)) {
      // value값을 map으로 반복문을 돌려서 button dom을 생성한다.
      value.map((el) => {
        // 위의 element에 button dom을 추가한다.
        element += `
            <button data-action="delete" data-filter-name="${el}" data-filter-group="${key}">
              ${el}
            </button>
        `;
        // 해당 element를 return 한다.
        return element;
      });
    }
    // 해당 element를 return 한다.
    return element;
  };

  // filterListBox를 생성한 뒤 filter-list-box dom을 생성하고 안에서 createFilterElement() 함수를 실행한다.
  const filterListBox = `
    <div class="filter-list-box">
      ${createFilterElements()}
      <button class="all-delete">Clear</button>
    </div>
  `;

  // filter 라는 li 안에 filterListBox를 집어넣는다.
  filter.innerHTML = filterListBox;
  // filterBox에 filter를 추가한다.
  filterBox.appendChild(filter);

  //  filter 안에 data-action이 delete인 모든 dom을 선택한 뒤 forEach 반복문으로
  // 모든 dom에 addEventListener로 removeSelected라는 함수를 실행시키게하고
  // 파라미터로 해당 dom에 data-filter-name과 data-filter-group값을 전달해여 removeSelected() 함수를 실행한다.
  const deleteFilter = filter.querySelectorAll("[data-action=delete]");

  deleteFilter.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const group = e.currentTarget.dataset.filterGroup;
      const value = e.currentTarget.dataset.filterName;

      removeSelected(group, value);
    });
  });

  // .all-delete 클래스를 가진 dom을 선택하여 클릭 시 selected의 모든 key와 value값을 초기화 시키고 redrawOffers() 함수를 실행시킨다.
  const allDeleteFilter = filter.querySelector(".all-delete");
  allDeleteFilter.addEventListener("click", () => {
    selected = { roles: [], levels: [], languages: [], tools: [] };
    filterBox.innerHTML = "";
    redrawOffers();
  });
};

// removeSelected에 group과 value파라미터를 전달하여
// 만약 selected의 group 키에 value값이 존재한다면
// filter로 해당 value값이 일치하지않으면 selected의 group 키에서 해당 값을 제거한다.
// 그다음 filterSelected()와 redrawOffers()를 실행한다.
const removeSelected = (group, value) => {
  if (selected[group].includes(value)) {
    selected[group] = selected[group].filter((el) => el !== value);
    filterSelected();
    redrawOffers();
  }

  // selected의 value값을 모두 선택한 뒤 curVal로 파라미터로 전달한 뒤 every 메서드로 curVal의 갯수가 0 개인지 확인하고 true이면 filterBox의 innerHTML을 초기화한다.
  const allValue = Object.values(selected);
  if (allValue.every((curVal) => curVal.length === 0)) {
    filterBox.innerHTML = "";
  }
};

const redrawOffers = () => {
  // main의 HTML을 초기화한다.
  main.innerHTML = "";

  offers
    .filter((items) => {
      // offers안의 각각의 value값의 length와 해당하는 value값이 존재하는지를 확인한다.
      // 만약의 해당하는 value값이 0개가 아니고, items의 해당하는 키의 값이 존재하지 않으면 그리지 않는다.
      // false된 값을 제외한 나머지를 forEach문으로 createOffers함수로 다시 그린다.
      const rolesNotEmpty = selected.roles.length !== 0;
      const itemRolesIsInSelected = selected.roles.includes(items.role);

      const levelsNotEmpty = selected.levels.length !== 0;
      const levelsIsInSelected = selected.levels.includes(items.level);

      const languagesNotEmpty = selected.languages.length !== 0;
      const offerLanguagesIsInSelected = selected.languages.every((curVal) =>
        items.languages.includes(curVal)
      );

      const toolsNotEmpty = selected.tools.length !== 0;
      const offerToolsIsInSelected = selected.tools.every((curVal) =>
        items.tools.includes(curVal)
      );

      if ((rolesNotEmpty === true) & (itemRolesIsInSelected === false)) {
        return false;
      }

      if ((levelsNotEmpty === true) & (levelsIsInSelected === false)) {
        return false;
      }

      if (languagesNotEmpty === true && offerLanguagesIsInSelected === false) {
        return false;
      }

      if (toolsNotEmpty === true && offerToolsIsInSelected === false) {
        return false;
      }

      return true;
    })
    .forEach((offer) => {
      createItems(offer);
    });
};
