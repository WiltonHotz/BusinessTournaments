using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using BusinessTournaments.Models.Entities;
using BusinessTournaments.Models.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BusinessTournaments
{
    public class Startup
    {
        private readonly IConfiguration config;

        public Startup(IConfiguration config)
        {
            this.config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            var connString = config.GetConnectionString("DefaultConnection");
            services.AddDbContext<CompanyContext>(c => c.UseSqlServer(connString));
            services.AddDbContext<BusinessTournamentsDBContext>(c => c.UseSqlServer(connString));

            services.AddIdentity<CompanyUser, IdentityRole>()
                .AddEntityFrameworkStores<CompanyContext>()
                .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(c => c.LoginPath = "/login");

            services.AddControllersWithViews();

            services.AddTransient<AccountService>();
            services.AddTransient<HomeService>();
            services.AddTransient<BracketsService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
