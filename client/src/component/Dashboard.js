import React, { Component } from 'react';
import '../style/Dashboard.css';

import axios from 'axios';

//COOKIES
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      cookie: false,
      movie: [],
      movie_tagline: '',
      movie_overview: '',
      movie_poster: '',
      movie_backdrop: '',
      screening: [],
    }
  }

  componentDidMount(){
    //Check cookies
    let cookiePeramban = cookies.get('MOVIETIME_ADMIN_SESSID')
            
    var url = 'http://localhost:6001/cookie';
    axios.post(url, {
        cookieMovietime: cookiePeramban,
    })
    .then((response) => {
        if (response.data.kode == '001'){
            this.setState({
                cookie: true,
            })
        }
        else if (response.data.kode == '002'){
            this.setState({
                cookie: false,
            })
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    //Ambil data movie dari database
    axios.get('http://localhost:6001/movie')
    .then((response) => {
        // console.log(response);
        this.setState({
            movie:response.data,
        })
    })

    //Ambil data screening dari database
    axios.get('http://localhost:6001/screening')
    .then((response) => {
        // console.log(response);
        this.setState({
            screening:response.data,
        })
    })
  }

  logOut(){
    // console.log(`Tes tombol logout jalan ga`)
    let cookiePeramban = cookies.get('MOVIETIME_ADMIN_SESSID')
    console.log(cookiePeramban)

    var url = 'http://localhost:6001/logout';
    axios.post(url, {
      cookieMovietime: cookiePeramban,
    })
    .then((response) => {
      console.log(response);
      if (response.data.kode == '001'){
        cookies.remove('MOVIETIME_ADMIN_SESSID')
      }
      window.location.replace('/admin');
    })
    .catch((error) => {
      console.log(error);
    });
}

  addMovie(){
    // console.log(`Fungsi addMovie sudah berjalan`)
    // console.log(this.refs.movie_id_input.value)
    // console.log(this.refs.movie_name_input.value)
    // console.log(this.refs.moviedb_id_input.value)
    let movie_id = this.refs.movie_id_input.value;
    let movie_name = this.refs.movie_name_input.value;
    let moviedb_id = this.refs.moviedb_id_input.value;

    //Ambil data tagline & overview dari moviedb.org sesuai moviedb_id yang ada
    axios.get(`https://api.themoviedb.org/3/movie/${this.refs.moviedb_id_input.value}?api_key=5c494406a56ba5a1cce62329a3880c81&language=en-US`)
    .then((ambilData) => {
      let movie_tagline = ambilData.data.tagline;
      let movie_overview = ambilData.data.overview;

      //Ambil data poster & backdrop dari moviedb.org sesuai moviedb_id yang ada
      axios.get(`https://api.themoviedb.org/3/movie/${this.refs.moviedb_id_input.value}/images?api_key=5c494406a56ba5a1cce62329a3880c81&language=en-US&include_image_language=en%2Cnull`)
      .then((ambilData) => {
        let movie_poster = `https://image.tmdb.org/t/p/original${ambilData.data.posters[0].file_path}`;
        let movie_backdrop = `https://image.tmdb.org/t/p/original${ambilData.data.backdrops[0].file_path}`;

        // Masukkan semua data movie ke database
        let url = 'http://localhost:6001/addmovie'
        axios.post(url, {
            id: movie_id,
            movie_name: movie_name,
            moviedb_id: moviedb_id,
            tagline: movie_tagline,
            overview: movie_overview,
            poster: movie_poster,
            backdrop: movie_backdrop,
        })
        .then((response) => {
            console.log(response)
            window.location.reload()
        })
        .catch(function (error) {
            console.log(error);
        });
      })
    })
  }

  deleteMovie(id){
    // console.log(`Fungsi deleteMovie berjalan. Ini idnya: ${id}`)
    let url = 'http://localhost:6001/deletemovie'
    axios.post(url, {
        id: id,
    })
    .then((response) => {
        console.log(response)
        alert(`Berhasil menghapus film dengan id ${id}`)
        window.location.reload()
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  updateMovie(id){
    // console.log(id);
    // console.log(this.refs.movie_name_update.value);
    // console.log(this.refs.moviedb_id_update.value);

    let movie_name = this.refs.movie_name_update.value;
    let moviedb_id = this.refs.moviedb_id_update.value;
    //Ambil data tagline & overview dari moviedb.org sesuai moviedb_id yang ada
    axios.get(`https://api.themoviedb.org/3/movie/${this.refs.moviedb_id_update.value}?api_key=5c494406a56ba5a1cce62329a3880c81&language=en-US`)
    .then((ambilData) => {
      let movie_tagline = ambilData.data.tagline;
      let movie_overview = ambilData.data.overview;

      //Ambil data poster & backdrop dari moviedb.org sesuai moviedb_id yang ada
      axios.get(`https://api.themoviedb.org/3/movie/${this.refs.moviedb_id_update.value}/images?api_key=5c494406a56ba5a1cce62329a3880c81&language=en-US&include_image_language=en%2Cnull`)
      .then((ambilData) => {
        let movie_poster = `https://image.tmdb.org/t/p/original${ambilData.data.posters[0].file_path}`;
        let movie_backdrop = `https://image.tmdb.org/t/p/original${ambilData.data.backdrops[0].file_path}`;

        // Masukkan semua data movie ke database
        let url = 'http://localhost:6001/updatemovie'
        axios.post(url, {
            id: id,
            movie_name: movie_name,
            moviedb_id: moviedb_id,
            tagline: movie_tagline,
            overview: movie_overview,
            poster: movie_poster,
            backdrop: movie_backdrop,
        })
        .then((response) => {
            console.log(response)
            window.location.reload()
        })
        .catch(function (error) {
            console.log(error);
        });
      })
    })
  }

  addScreening(){
    // console.log(`Fungsi addScreening sudah berjalan`)
    // console.log(this.refs.screening_id_input.value)
    // console.log(this.refs.movie_id_input.value)
    // console.log(this.refs.cinema_id_input.value)
    // console.log(this.refs.theater_id_input.value)
    // console.log(this.refs.day_input.value)
    // console.log(this.refs.date_time_input.value)
    // console.log(this.refs.price_input.value)

    let url = 'http://localhost:6001/addscreening'
    axios.post(url, {
        screening_id: this.refs.screening_id_input.value,
        movie_id: this.refs.movie_id_input.value,
        cinema_id: this.refs.cinema_id_input.value,
        theater_id: this.refs.theater_id_input.value,
        day: this.refs.day_input.value,
        date_time: this.refs.date_time_input.value,
        price: this.refs.price_input.value,
    })
    .then((response) => {
        console.log(response)
        alert(`Berhasil menambah screening dengan id ${this.refs.screening_id_input.value}`)
        window.location.reload()
    })
    .catch(function (error) {
        console.log(error);
    });

  }

  deleteScreening(id){
    // console.log(`Fungsi deleteMovie berjalan. Ini idnya: ${id}`)
    let url = 'http://localhost:6001/deletescreening'
    axios.post(url, {
        id: id,
    })
    .then((response) => {
        console.log(response)
        alert(`Berhasil menghapus film dengan id ${id}`)
        window.location.reload()
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  updateScreening(id){
    // console.log(id);
    // console.log(this.refs.movie_id_update.value)
    // console.log(this.refs.cinema_id_update.value)
    // console.log(this.refs.theater_id_update.value)
    // console.log(this.refs.day_update.value)
    // console.log(this.refs.date_time_update.value)
    // console.log(this.refs.price_update.value)

    let url = 'http://localhost:6001/updatescreening'
    axios.post(url, {
        id: id,
        movie_id: this.refs.movie_id_update.value,
        cinema_id: this.refs.cinema_id_update.value,
        theater_id: this.refs.theater_id_update.value,
        day: this.refs.day_update.value,
        date_time: this.refs.date_time_update.value,
        price: this.refs.price_update.value,
    })
    .then((response) => {
        console.log(response)
        alert(`Berhasil memperbaharui film dengan id ${id}`)
        window.location.reload()
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  render() {
    const movie = this.state.movie.map((item, index) => {
      return (
        <tr key={index}>
          <td><a href="" data-toggle="modal" data-target={'#updateMovie' + item.id}>{item.id}</a></td>
          <td>{item.movie_name}</td>
          <td>{item.moviedb_id}</td>
          <td>{item.tagline}</td>
          <td>{item.overview}</td>
          <td>{item.backdrop}</td>
          <td>{item.poster}</td>
          <td><button onClick={()=> {this.deleteMovie(item.id)}} className="btn btn-dark mt-btn my-2 my-sm-0 add-button" type="submit">Delete</button></td>
        </tr>    
      )
    })
    
    const updateMovie = this.state.movie.map((item, index) => {
      return (
          <div key={index} className="modal fade" id={'updateMovie' + item.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">UPDATE MOVIE {item.id}</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input ref="movie_name_update" type="text" className="form-control" placeholder="Update movie_name"/><br />
                  <input ref="moviedb_id_update" type="text" className="form-control" placeholder="Update moviedb_id"/><br />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" onClick={()=>{this.updateMovie(item.id)}} className="btn btn-primary">UPDATE</button>
                </div>
              </div>
            </div>
          </div>
      )
    })

    const screening = this.state.screening.map((item, index) => {
      return (
        <tr key={index}>
          <td><a href="" data-toggle="modal" data-target={'#updateScreening' + item.id}>{item.id}</a></td>
          <td>{item.movie_id}</td>
          <td>{item.cinema_id}</td>
          <td>{item.theater_id}</td>
          <td>{item.day}</td>
          <td>{item.date_time}</td>
          <td>{item.price}</td>
          <td><button onClick={()=> {this.deleteScreening(item.id)}} className="btn btn-dark mt-btn my-2 my-sm-0 add-button" type="submit">Delete</button></td>
        </tr>    
      )
    })

    const updateScreening = this.state.screening.map((item, index) => {
      return (
          <div key={index} className="modal fade" id={'updateScreening' + item.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">UPDATE Screening {item.id}</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input ref="movie_id_update" type="text" className="form-control" placeholder="Update movie_id"/><br />
                  <input ref="cinema_id_update" type="text" className="form-control" placeholder="Update cinema_id"/><br />
                  <input ref="theater_id_update" type="text" className="form-control" placeholder="Update theater_id"/><br />
                  <input ref="day_update" type="text" className="form-control" placeholder="Update day"/><br />
                  <input ref="date_time_update" type="text" className="form-control" placeholder="Update date_time"/><br />
                  <input ref="price_update" type="text" className="form-control" placeholder="Update price"/><br />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" onClick={()=>{this.updateScreening(item.id)}} className="btn btn-primary">UPDATE</button>
                </div>
              </div>
            </div>
          </div>
      )
    })

    return (
      <div className="Dashboard">
      <center>
        <table>
          <tbody>
            <tr>
              <td><h1>Dashboard</h1></td>
              <td><button onClick={()=>{this.logOut()}} className="btn btn-outline-success mt-btn my-2 my-sm-0 add-button" >Log Out</button></td>
            </tr>
          </tbody>
        </table>
      </center>
      
      <ul className="nav nav-pills" id="pills-tab" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" id="pills-Movie-tab" data-toggle="pill" href="#pills-Movie" role="tab" aria-controls="pills-Movie" aria-selected="true">Movie</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="pills-Screening-tab" data-toggle="pill" href="#pills-Screening" role="tab" aria-controls="pills-Screening" aria-selected="false">Screening</a>
        </li>
      </ul>

      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-Movie" role="tabpanel" aria-labelledby="pills-Movie-tab">
          <button className="btn btn-dark mt-btn my-2 my-sm-0 add-button" data-toggle="modal" data-target="#addMovie">ADD MOVIE</button>
          <br />
          <br />

          {/* <!-- Modal ADD MOVIE --> */}
          <div className="modal fade" id="addMovie" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">ADD MOVIE</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input ref="movie_id_input" type="text" className="form-control" aria-describedby="emailHelp" placeholder="Enter movie_id"/><br />
                  <input ref="movie_name_input" type="text" className="form-control" placeholder="Enter movie_name"/><br />
                  <input ref="moviedb_id_input" type="text" className="form-control" placeholder="Enter moviedb_id"/><br />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" onClick={()=>{this.addMovie()}} className="btn btn-primary">ADD</button>
                </div>
              </div>
            </div>
          </div>

          {updateMovie}

          <div className="table-responsive-sm">
            <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">movie_name</th>
                      <th scope="col">moviedb_id</th>
                      <th scope="col">tagline</th>
                      <th scope="col">overview</th>
                      <th scope="col">backdrop</th>
                      <th scope="col">poster</th>
                      <th scope="col">delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movie}
                  </tbody>
                </table>
            </div>
          </div>

          {/* SCREENING */}
          <div className="tab-pane fade show" id="pills-Screening" role="tabpanel" aria-labelledby="pills-Movie-tab">
          <button className="btn btn-dark mt-btn my-2 my-sm-0 add-button" data-toggle="modal" data-target="#addScreening">ADD SCREENING</button>
          <br />
          <br />

          {/* <!-- Modal ADD SCREENING --> */}
          <div className="modal fade" id="addScreening" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">ADD SCREENING</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input ref="screening_id_input" type="text" className="form-control" aria-describedby="emailHelp" placeholder="Enter screening_id"/><br />
                  <input ref="movie_id_input" type="text" className="form-control" placeholder="Enter movie_id"/><br />
                  <input ref="cinema_id_input" type="text" className="form-control" placeholder="Enter cinema_id"/><br />
                  <input ref="theater_id_input" type="text" className="form-control" placeholder="Enter theater_id"/><br />
                  <input ref="day_input" type="text" className="form-control" placeholder="Enter day"/><br />
                  <input ref="date_time_input" type="text" className="form-control" placeholder="Enter date_time"/><br />
                  <input ref="price_input" type="text" className="form-control" placeholder="Enter price"/><br />

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" onClick={()=>{this.addScreening()}} className="btn btn-primary">ADD</button>
                </div>
              </div>
            </div>
          </div>

          {updateScreening}

          <div className="table-responsive-sm">
            <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">movie_id</th>
                      <th scope="col">cinema_id</th>
                      <th scope="col">theater_id</th>
                      <th scope="col">day</th>
                      <th scope="col">date_time</th>
                      <th scope="col">price</th>
                      <th scope="col">delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screening}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    );
  } 
}

export default Dashboard;
