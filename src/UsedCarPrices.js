import React from 'react'
import Select from 'react-select';
import { throttle } from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import config from './config';

class UsedCarPrices extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			backEndDomain: config.backEndDomain,
			manufacturerOptions: [],
			modelOptions: [],
			manufacturerOption: "",
			modelOption: "",
		};

		this.handleChange = this.handleChange.bind(this)
		this.throttledHandleManufacturerSearch = throttle(this.handleManufacturerSearch, 500).bind(this);
		this.throttledHandleModelSearch = throttle(this.handleModelSearch, 500).bind(this);
	}

  handleManufacturerSearch = (inputValue) => {

  	if(inputValue != "" && inputValue != null){
			fetch(`${this.state.backEndDomain}/manufacturer?manufacturer_name=${inputValue}`, {
			  method: 'GET'
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(!("errors" in responseJson)){
					var options = responseJson.map((row) =>{
						return(
							{label:row.name, value:row.id}
						)
					});
					this.setState({
						manufacturerOptions: options,
						modelOptions: [],
						modelOption: "",
					});
				}else{
					this.setState({
					});
				}
			})
			.catch((error) => {
  		})
  	}

  };

  handleModelSearch = (inputValue) => {

  	if(inputValue != "" && inputValue != null){
			fetch(`${this.state.backEndDomain}/model?manufacturer_id=${this.state.manufacturerOption.value}&model_name=${inputValue}`, {
			  method: 'GET'
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(!("errors" in responseJson)){
					var options = responseJson.map((row) =>{
						return(
							{label:row.name, value:row.name}
						)
					});
					this.setState({
						modelOptions: options,
					});
				}else{
					this.setState({
					});
				}
			})
			.catch((error) => {
  		})
  	}

  };

  handleManufacturerSelect = (selectedOption) => {
    this.setState({ manufacturerOption: selectedOption });
  };

  handleModelSelect = (selectedOption) => {
    this.setState({ modelOption: selectedOption });
  };

	handleChange = (event) => {
		const name = event.target.name
		const value = event.target.type == 'checkbox' ? event.target.checked : event.target.value

		this.setState({
			[name]: value
		});
	}

	render(){
		return(
			<div className="container pt-3">
				<form className="row">

					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Select manufacturer</label>
      			<Select
      				className=""
      			  value={this.state.manufacturerOption}
      			  options={this.state.manufacturerOptions}
      			  onChange={this.handleManufacturerSelect}
							onInputChange={this.throttledHandleManufacturerSearch}
      			/>
					</div>

					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Select model</label>
      			<Select
      				className=""
      			  value={this.state.modelOption}
      			  options={this.state.modelOptions}
      			  onChange={this.handleModelSelect}
							onInputChange={this.throttledHandleModelSearch}
      			/>
					</div>

				</form>
			</div>			
		);
	}
}

export default UsedCarPrices;