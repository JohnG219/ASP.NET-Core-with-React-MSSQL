using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using PracticalExamAPI.Model;

namespace PracticalExamAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormpersonController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public FormpersonController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Formperson> formpersons = new List<Formperson>();

            string? query = @"
                    SELECT FormpersonId, FirstName, LastName, Email, Phone
                    FROM dbo.Formperson
                    ";

            string? sqlDataSource = _configuration.GetConnectionString("FormpersonAppCon");

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                using (SqlDataReader myReader = myCommand.ExecuteReader())
                {
                    while (myReader.Read())
                    {
                        Formperson formperson = new Formperson
                        {
                            FormpersonId = Convert.ToInt32(myReader["FormpersonId"]),
                            FirstName = myReader["FirstName"].ToString(),
                            LastName = myReader["LastName"].ToString(),
                            Email = myReader["Email"].ToString(),
                            Phone = myReader["Phone"].ToString(),
                        };
                        formpersons.Add(formperson);
                    }
                }
            }

            return new JsonResult(formpersons);
        }

        [HttpPost]
        public JsonResult Post(Formperson emp)
        {
            string query = @"
               INSERT INTO dbo.Formperson (FirstName, LastName, Email, Phone)
               VALUES (@FirstName, @LastName, @Email, @Phone)
                ";

            DataTable table = new DataTable();
            string? sqlDataSource = _configuration.GetConnectionString("FormpersonAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@FirstName", emp.FirstName);
                    myCommand.Parameters.AddWithValue("@LastName", emp.LastName);
                    myCommand.Parameters.AddWithValue("@Email", emp.Email);
                    myCommand.Parameters.AddWithValue("@Phone", emp.Phone);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Post Successfully");
        }

        [HttpPut]
        public JsonResult Put(Formperson emp)
        {
            string query = @"
                UPDATE dbo.Formperson
                SET FirstName = @FirstName,
                    LastName = @LastName,
                    Email = @Email,
                    Phone = @Phone
                WHERE FormpersonId = @FormpersonId
                ";

            DataTable table = new DataTable();
            string? sqlDataSource = _configuration.GetConnectionString("FormpersonAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@FormpersonId", emp.FormpersonId);
                    myCommand.Parameters.AddWithValue("@FirstName", emp.FirstName);
                    myCommand.Parameters.AddWithValue("@LastName", emp.LastName);
                    myCommand.Parameters.AddWithValue("@Email", emp.Email);
                    myCommand.Parameters.AddWithValue("@Phone", emp.Phone);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Updated Successfully");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"
                DELETE FROM dbo.Formperson
                WHERE FormpersonId = @FormpersonId
                ";

            DataTable table = new DataTable();
            string? sqlDataSource = _configuration.GetConnectionString("FormpersonAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@FormpersonId", id);

                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Deleted Successfully");
        }
    }
}