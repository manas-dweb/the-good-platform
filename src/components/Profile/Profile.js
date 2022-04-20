import React from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const user = useSelector((state) => state.authentication.user);
  return (
    <>
      <section className="section profile">
        <div className="row">
          <div className="pagetitle">
            <h1>Profile</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                <img
                  src="assets/img/profile-img.jpg"
                  alt="Profile"
                  className="rounded-circle"
                />
                <h2>Kevin Anderson</h2>
                <h3>Web Designer</h3>
                <div className="social-links mt-2">
                  <a href="#" className="twitter">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" className="linkedin">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body pt-3">
                <ul className="nav nav-tabs nav-tabs-bordered">
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-overview"
                    >
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-edit"
                    >
                      Edit Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-change-password"
                    >
                      Change Password
                    </button>
                  </li>
                </ul>
                <div className="tab-content pt-2">
                  <div
                    className="tab-pane fade show active profile-overview"
                    id="profile-overview"
                  >
                    <h5 className="card-title">About</h5>
                    <p className="small fst-italic">
                      Sunt est soluta temporibus accusantium neque nam maiores
                      cumque temporibus. Tempora libero non est unde veniam est
                      qui dolor. Ut sunt iure rerum quae quisquam autem eveniet
                      perspiciatis odit. Fuga sequi sed ea saepe at unde.
                    </p>
                    <h5 className="card-title">Profile Details</h5>
                    <div className="row">
                      <div className="col-lg-3 col-md-4 label ">Full Name</div>
                      <div className="col-lg-9 col-md-8">Kevin Anderson</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Company</div>
                      <div className="col-lg-9 col-md-8">
                        Lueilwitz, Wisoky and Leuschke
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Job</div>
                      <div className="col-lg-9 col-md-8">Web Designer</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Country</div>
                      <div className="col-lg-9 col-md-8">USA</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Address</div>
                      <div className="col-lg-9 col-md-8">
                        A108 Adam Street, New York, NY 535022
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Phone</div>
                      <div className="col-lg-9 col-md-8">
                        (436) 486-3538 x29071
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Email</div>
                      <div className="col-lg-9 col-md-8">
                        k.anderson@example.com
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade profile-edit pt-3"
                    id="profile-edit"
                  >
                    <form>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Profile Image
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <img src="assets/img/profile-img.jpg" alt="Profile" />
                          <div className="pt-2">
                            <a
                              href="#"
                              className="btn btn-primary btn-sm"
                              title="Upload new profile image"
                            >
                              <i className="bi bi-upload"></i>
                            </a>
                            <a
                              href="#"
                              className="btn btn-danger btn-sm"
                              title="Remove my profile image"
                            >
                              <i className="bi bi-trash"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Full Name
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="fullName"
                            type="text"
                            className="form-control"
                            id="fullName"
                            value="Kevin Anderson"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          About
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <textarea
                            name="about"
                            className="form-control"
                            rows="4"
                            cols="50"
                          >
                            Sunt est soluta temporibus accusantium neque nam
                            maiores cumque temporibus. Tempora libero non est
                            unde veniam est qui dolor. Ut sunt iure rerum quae
                            quisquam autem eveniet perspiciatis odit. Fuga sequi
                            sed ea saepe at unde.
                          </textarea>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Company
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="company"
                            type="text"
                            className="form-control"
                            id="company"
                            value="Lueilwitz, Wisoky and Leuschke"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Job
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="job"
                            type="text"
                            className="form-control"
                            id="Job"
                            value="Web Designer"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Country
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="country"
                            type="text"
                            className="form-control"
                            id="Country"
                            value="USA"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Address
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="address"
                            type="text"
                            className="form-control"
                            id="Address"
                            value="A108 Adam Street, New York, NY 535022"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Phone
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="phone"
                            type="text"
                            className="form-control"
                            id="Phone"
                            value="(436) 486-3538 x29071"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Email
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="email"
                            type="email"
                            className="form-control"
                            id="Email"
                            value="k.anderson@example.com"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Twitter Profile
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="twitter"
                            type="text"
                            className="form-control"
                            id="Twitter"
                            value="https://twitter.com/#"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Facebook Profile
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="facebook"
                            type="text"
                            className="form-control"
                            id="Facebook"
                            value="https://facebook.com/#"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Instagram Profile
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="instagram"
                            type="text"
                            className="form-control"
                            id="Instagram"
                            value="https://instagram.com/#"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Linkedin Profile
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="linkedin"
                            type="text"
                            className="form-control"
                            id="Linkedin"
                            value="https://linkedin.com/#"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                  <div
                    className="tab-pane fade pt-3"
                    id="profile-change-password"
                  >
                    <form>
                      <div className="row mb-3">
                        <label className="col-md-6 col-form-label">
                          Current Password
                        </label>
                        <div className="col-md-6">
                          <input
                            name="password"
                            type="password"
                            className="form-control"
                            id="currentPassword"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-6 col-form-label">
                          New Password
                        </label>
                        <div className="col-md-6">
                          <input
                            name="newpassword"
                            type="password"
                            className="form-control"
                            id="newPassword"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-md-6 col-form-label">
                          Re-enter New Password
                        </label>
                        <div className="col-md-6">
                          <input
                            name="renewpassword"
                            type="password"
                            className="form-control"
                            id="renewPassword"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Profile;
