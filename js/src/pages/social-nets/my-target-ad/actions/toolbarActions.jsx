export function incrementFavoritesCoun(count) {
  return {
    type: 'INCREMENT_FAVORITES',
    payload: count,
  };
}

export function decrementFavoritesCoun(count) {
  return {
    type: 'DECREMENT_FAVORITES',
    payload: count,
  };
}

export function addTooFavorites(ads_id, notificationSystem) {
  return dispatch => {
    if (ads_id.length === 0) {
      notificationSystem({
        message: 'Не выбрано ни одно объявление!',
        level: 'error',
        autoDismiss: 2,
        position: 'tc',
      });
      return false;
    }

    window.$.post('/teazer/favorites/add', { ads_id }, result => {
      let msg;

      if (result.success === true) {
        if (ads_id.length === result.add_cnt) {
          msg = `${result.add_cnt} добавлено в избранное <a href="/teazer/favorites/index">перейти в избранное</a>`;
        } else if (result.add_cnt === 0) {
          msg = 'Все выбранные объявления уже присутствуют в разделе "Избранное"!';
        } else if (typeof result.msg !== 'undefined' && typeof result.status !== 'undefined' && result.status === 'free') {
          msg = result.msg;
        } else if (typeof result.msg !== 'undefined') {
          msg = `${result.add_cnt} добавлено в избранное. ${result.msg} <a href="/teazer/favorites/index">перейти в избранное</a>`;
        } else {
          msg = `${result.add_cnt} добавлено в избранное. Остальные повторяются. <a href="/teazer/favorites/index">перейти в избранное</a>'`;
        }

        notificationSystem({
          message: msg,
          level: 'success',
          autoDismiss: 5,
          position: 'tc',
        });

        return dispatch(incrementFavoritesCoun(result.add_cnt));
      }

      if (result.success === false && typeof result.msg !== 'undefined') {
        notificationSystem({
          message: result.msg,
          level: 'warning',
          autoDismiss: 3,
          position: 'tc',
        });
      }
    }, 'json')
    .fail(() => notificationSystem({
      message: 'Неудалось добавить объявления!',
      level: 'error',
      autoDismiss: 2,
      position: 'tc',
    }));
  };
}

export function loadProjectsList() {
  return dispatch => {
    window.$.post('/projects/get/group', result => {
      dispatch({
        type: 'LOAD_PROJECTS_LIST',
        payload: result.items,
      });
    }, 'json');
  };
}

export function loadNetList() {
  return dispatch => {
    window.$.post('/projects/get/netlist', result => {
      dispatch({
        type: 'LOAD_NETS_LIST',
        payload: result.items,
      });
    }, 'json');
  };
}

export function addTeasersToProject(projId, adsId, notification) {
  return dispatch => {
    window.$.post('/projects/create/attach', { projId, adsId }, result => {
      if (result.success) {
        notification({
          message: `Тизеры успешно добавлены! <a href="/projects/show/${projId}">Перейти в проект</a>`,
          level: 'success',
          autoDismiss: 5,
          position: 'tc',
        });
      }
    }, 'json');
  };
}

export function addNewProject(newProject) {
  return {
    type: 'ADD_NEW_PROJECT',
    payload: newProject,
  };
}

const selectTeasersMsg = {
  message: 'Выберите тизеры',
  level: 'error',
  autoDismiss: 5,
  position: 'tc',
};

export function getImages(selectedTeasers, notification) {
  return dispatch => {
    if (!selectedTeasers.length) {
      return notification(selectTeasersMsg);
    }

    if (window.confirm('Вы действительно хотите получить картинки для выделенных тизеров?')) {
      $.post('/teazer/imager/save', { ads_id: selectedTeasers }, data => {
        if (typeof data.success !== 'undefined' && data.success === true) {
          return notification({
            message: data.msg,
            level: 'success',
            autoDismiss: 5,
            position: 'tc',
          });
        }
        notification({
          message: 'Обновить изображения не удалось, возможно источник еще не был добавлен',
          level: 'error',
          autoDismiss: 5,
          position: 'tc',
        });
      }, 'json');
    }
  };
}

export function checkAdultTsr(selectedTeasers, notification) {
  return dispatch => {
    if (!selectedTeasers.length) {
      return notification(selectTeasersMsg);
    }

    if (window.confirm('Вы действительно хотите определить тизеры в адалт категорию?')) {
      $.post('/teazer/adult/teaser', { ads_id: selectedTeasers }, data => {
        if (typeof data.success !== 'undefined' && data.success === true) {
          return notification({
            message: `Тизеры добавлены в адалт категорию (${selectedTeasers.length})`,
            level: 'success',
            autoDismiss: 5,
            position: 'tc',
          });
        }
      }, 'json');
    }
  };
}

export function checkAdultLnd(selectedTeasers, notification) {
  return dispatch => {
    if (!selectedTeasers.length) {
      return notification(selectTeasersMsg);
    }

    if (window.confirm('Вы действительно хотите определить данные лендинги как адалт?')) {
      $.post('/teazer/adult/landing', { ads_id: selectedTeasers }, data => {
        if (typeof data.success !== 'undefined' && data.success === true) {
          return notification({
            message: `Тизеры добавлены в адалт категорию (${data.cnt})`,
            level: 'success',
            autoDismiss: 5,
            position: 'tc',
          });
        }
      }, 'json');
    }
  };
}

export function checkCats(selectedTeasers, notification, cat_id) {
  return dispatch => {
    if (!selectedTeasers.length) {
      return notification(selectTeasersMsg);
    }

    if (window.confirm('Вы действительно хотите определить категорию тизеров?')) {
      $.post('/teazer/cats/teaser', { ads_id: selectedTeasers, cat_id }, data => {
        if (typeof data.success !== 'undefined' && data.success === true) {
          return notification({
            message: `Категория тизеров определена (${selectedTeasers.length})`,
            level: 'success',
            autoDismiss: 5,
            position: 'tc',
          });
        }
      }, 'json');
    }
  };
}

export function checkCatsLnd(selectedTeasers, notification, cat_id) {
  return dispatch => {
    if (!selectedTeasers.length) {
      return notification(selectTeasersMsg);
    }

    if (window.confirm('Вы действительно хотите определить данные лендинги в данную категорию?')) {
      $.post('/teazer/cats/landing', { ads_id: selectedTeasers, cat_id }, data => {
        if (typeof data.success !== 'undefined' && data.success === true) {
          return notification({
            message: `Категория тизеров определена (${data.cnt})`,
            level: 'success',
            autoDismiss: 5,
            position: 'tc',
          });
        }
      }, 'json');
    }
  };
}











