import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { circlePreloader } from '../../../../components/advertika/helpers';
import WrapperDropdown from '../../../../components/advertika/wrapper-dropdown';


export default class ToolbarPropjects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projVisibility: false,
      newProjectVisibility: false,
      searchProject: '',
      selectedProject: '',
      selectedTN: '1',
    };

    this.toggleProgectContainer = this.toggleProgectContainer.bind(this);
  }

  toggleProgectContainer() {
    if (!this.props.toolbarProjects.savedProjects.length) {
      this.props.loadProjectsList();
    }
    // if (!this.props.toolbarProjects.teaserNetList.length) {
    //   this.props.loadNetList();
    // }

    this.setState({
      projVisibility: !this.state.projVisibility,
      newProjectVisibility: false,
    });
  }

  selectProject(selectedProject) {
    this.setState({
      selectedProject,
      projVisibility: false,
    });
  }

  selectTN(selectedTN) {
    this.refs.teaserNetList.handleCloseDropdown();
    this.setState({ selectedTN });
  }

  createNewProject() {
    const title = this.refs.nameNewProject.value;
    const net_id = this.state.selectedTN;
    if (title === '') {
      return this.props.notification({
        message: 'Введите название проекта.',
        level: 'error',
        autoDismiss: 5,
        position: 'tc',
        // action:{
        //   label: 'Выбрать или создать проект',
        //   callback: () => this.toggleProgectContainer(),
        // }
      });
    }
    $.post('/projects/create/group', { title, net_id }, response => {

      if (response.success === false) {
        return this.props.notification({
          message: `
            <p>${response.error}</p>
            <div class="center">
              <a class="[ button __success __sm ] " href="/cabinet/info/teazacc" >Перейти к созданию аккаунта</a>
            </div>
            `,
          level: 'error',
          autoDismiss: 0,
          position: 'tc',
        });
      }
      if (response.success === true) {
        this.props.addNewProject({ title: response.title, id: response.id });
        this.setState({
          projVisibility: false,
          newProjectVisibility: false,
          selectedProject: response.id,
        });
      }
    }, 'json');
  }

  addSelectedTeasersToProject(selectedProject) {
    const { notification, selectedTeasers } = this.props;
    if (selectedProject == '') {
      return this.props.notification({
        message: 'Выберите или создайте проект',
        level: 'warning',
        autoDismiss: 5,
        position: 'tc',
        // action:{
        //   label: 'Выбрать или создать проект',
        //   callback: () => this.toggleProgectContainer(),
        // }
      });
    }

    if (!selectedTeasers.length) {
      return this.props.notification({
        message: 'Отметьте тизеры которые хотите добавить в выбранный проект',
        level: 'warning',
        autoDismiss: 5,
        position: 'tc',
      });
    }

    this.props.addTeasersToProject(selectedProject, selectedTeasers, notification);
  }

  showNewProjectForm() {
    if (!this.props.toolbarProjects.teaserNetList.length) {
      this.props.loadNetList();
    }
    this.setState({ newProjectVisibility: true });
  }

  searchPrijectInList(e) {
    this.setState({ searchProject: e.target.value });
  }

  render() {
    const { selectedProject, selectedTN, searchProject, filterTitle } = this.state;
    const { toolbarProjects: { savedProjects, teaserNetList } } = this.props;
    const newProjectVisibility = (this.state.newProjectVisibility );
    // const newProjectVisibility = (this.state.newProjectVisibility || !this.props.toolbarProjects.savedProjects.length);

    const projectList = (projects) => (
      <div style={{ display: !newProjectVisibility ? 'block' : 'none' }}>
        <input
          type="text"
          className="field __block"
          placeholder="Найти проект"
          value={searchProject}
          onChange={e => this.searchPrijectInList(e)}
        />
        <div className="w-project-choise_projects-cnt">

        {!!projects.length &&

            <ul className="w-project-choise_projects-list">
              {projects
                .filter(item => (item.title.toLowerCase().indexOf(searchProject.toLowerCase()) !== -1))
                .map((project, i) => (
                  <li
                    key={i}
                    onClick={() => this.selectProject(project.id)}
                    className={
                      `w-project-choise_project ellipsis ${
                        project.id === selectedProject ? '__active' : ''
                      } `
                    }
                  >
                    {project.title}
                  </li>
              ))}
            </ul>
          }

        </div>
        <button
          className="button __link __block"
          ref="createButton"
          onClick={e => this.showNewProjectForm(e)}
        >
          + Создать новый
        </button>
      </div>

    );
    const newProject = (netList) => (

      <div style={{ display: newProjectVisibility ? 'block' : 'none' }}>
        <div className="mb1 h4 center">Название проекта:</div>
        <input
          type="text"
          className="field __block mb2"
          placeholder="Название проекта"
          ref="nameNewProject"
        />

        <div className="py1 h4 center">Шаблон сети:</div>
        {netList.length
          ? (
            <WrapperDropdown
              ref="teaserNetList"
              positionClass="__duleft"
              wrapClass="mb4"
              title={netList.filter(tn => tn.id === selectedTN)[0].title}

              applySelected={this.applyFilter}
            >
              <ul>
              {netList.map((item, i) => (
                <li
                  key={i}
                  className={item.id === selectedTN ? '__active' : ''}
                  onClick={(e) => this.selectTN(item.id, e)}
                >
                  {item.title}
                </li>
              ))}
              </ul>
            </WrapperDropdown>
          )
          : (
            <div className="mb4">
              {circlePreloader(40, 40)}
            </div>
          )}

        <button
          className="button __default __block"
          onClick={() => this.createNewProject()}
        >
          Создать проект
        </button>
      </div>

    );


    return (
          <div
            className="toolbar_item __add"

          >
            <div className="clearfix relative">
              {this.state.projVisibility &&
                <div className="w-project-choise" ref="projectContainer">
                  {newProject(teaserNetList)}
                  {projectList(savedProjects)}
                </div>

                }
              <div className="col_half left center">

                <div className="toolbar_item-title">Проект</div>
                <div className="ellipsis">
                {selectedProject !== '' &&

                    <a
                      href={`/projects/show/${selectedProject}`}
                      className="button __sm __default w-project-choise_spb"
                    >
                      {savedProjects.filter(project => project.id === selectedProject)[0].title}
                    </a>}

                    <button
                      type="button"

                      onClick={() => this.toggleProgectContainer()}
                      className={`button __sm __default ${(selectedProject !== '') && 'ion-arrow-up-b'}`}
                    >
                      {(selectedProject === '') && 'Выбрать или Создать'}
                    </button>

                </div>
              </div>

              <div className="col_half left center">
                <button
                  className="button __primary __sm "
                  style={{ marginTop: '22px' }}
                  type="button"
                  onClick={() => this.addSelectedTeasersToProject(selectedProject)}
                >
                  Добавить в проект
                </button>
              </div>

            </div>

            {this.state.projVisibility &&
              <div
                onClick={this.toggleProgectContainer}
                style={{
                  position: 'fixed',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 0,
                }}
              />}
          </div>


    );
  }
}

ToolbarPropjects.propTypes = {
  savedProjects: PropTypes.array,
  teaserNetList: PropTypes.array,
  loadProjectsList: PropTypes.func,
  loadNetList: PropTypes.func,
  selectedTeasers: PropTypes.array,
  notification: PropTypes.func,
  addTeasersToProject: PropTypes.func,
  toolbarProjects: PropTypes.object,
};
