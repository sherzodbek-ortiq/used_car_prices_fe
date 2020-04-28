import React from "react"
import Select from 'react-select';
import { throttle } from 'lodash';

class UsedCarPrices extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			manufacturer_id:"",
			manufacturer_name:"",
			model_name:"",
			options: [],
			selectedOption: "",
			inputValue: ""
		};

		this.handleChange = this.handleChange.bind(this)
		this.throttledHandleSearch = throttle(this.handleSearch, 500).bind(this);
	}

  handleSearch = (inputValue) => {

		this.setState({
			inputValue: inputValue,
		})

  	if(inputValue != "" && inputValue != null){
			fetch(`http://localhost:3001/manufacturer?manufacturer_name=${inputValue}`, {
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
						options: options,
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

  handleSelect = (selectedOption) => {
    this.setState({ selectedOption: selectedOption });
  };

	handleChange(event){
		const name = event.target.name
		const value = event.target.type == 'checkbox' ? event.target.checked : event.target.value

		this.setState({
			[name]: value
		});
	}

	render(){
		return(
			<div className="">
				<form className="row">

					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Select</label>
      			<Select
      				className=""
      			  value={this.state.selectedOption}
      			  options={this.state.options}
      			  onChange={this.handleSelect}
							onInputChange={this.throttledHandleSearch}
      			/>
					</div>

				</form>
			</div>			
		);
	}
}

export default UsedCarPrices;