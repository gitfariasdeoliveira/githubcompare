import React, { Component } from "react";
import moment from "moment";
import api from "../../services/api";

import logo from "../../assets/logo.png";
import { Container, Form } from "./styles";

import CompareList from "../../components/CompareList";

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repostiroryInput: "",
    repositories: []
  };

  handleAddRepository = async evento => {
    evento.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(
        `/repos/${this.state.repostiroryInput}`
      );

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repostiroryInput: "",
        repositories: [...this.state.repositories, repository],
        repositoryError: false
      });
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form
          withError={this.state.repositoryError}
          onSubmit={this.handleAddRepository}
        >
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repostiroryInput}
            onChange={evento =>
              this.setState({ repostiroryInput: evento.target.value })
            }
          />
          <button type="submit">
            {this.state.loading ? (
              <i className="fa fa-spinner fa-pulse" />
            ) : (
              "OK"
            )}
          </button>
        </Form>

        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
