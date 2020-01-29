using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BusinessTournaments.Models.Entities
{
    public partial class BusinessTournamentsDBContext : DbContext
    {
        public BusinessTournamentsDBContext()
        {
        }

        public BusinessTournamentsDBContext(DbContextOptions<BusinessTournamentsDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<Players> Players { get; set; }
        public virtual DbSet<T2p> T2p { get; set; }
        public virtual DbSet<Theme2Company> Theme2Company { get; set; }
        public virtual DbSet<Themes> Themes { get; set; }
        public virtual DbSet<Tournaments> Tournaments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=BusinessTournamentDummy;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail)
                    .HasName("EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName)
                    .HasName("UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.SelectedTheme).HasMaxLength(50);

                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            modelBuilder.Entity<Players>(entity =>
            {
                entity.HasIndex(e => new { e.Name, e.CompanyId })
                    .HasName("UQ__Players__A1ACF532B60C31E3")
                    .IsUnique();

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasColumnName("CompanyID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(23);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Players)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Players__Company__3B75D760");
            });

            modelBuilder.Entity<T2p>(entity =>
            {
                entity.ToTable("T2P");

                entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

                entity.Property(e => e.TournamentId).HasColumnName("TournamentID");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.T2p)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__T2P__PlayerID__3C69FB99");

                entity.HasOne(d => d.Tournament)
                    .WithMany(p => p.T2p)
                    .HasForeignKey(d => d.TournamentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__T2P__TournamentI__49C3F6B7");
            });

            modelBuilder.Entity<Theme2Company>(entity =>
            {
                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Theme2Company)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Theme2Com__Compa__60A75C0F");

                entity.HasOne(d => d.Theme)
                    .WithMany(p => p.Theme2Company)
                    .HasForeignKey(d => d.ThemeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Theme2Com__Theme__5FB337D6");
            });

            modelBuilder.Entity<Themes>(entity =>
            {
                entity.Property(e => e.ThemeName)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Tournaments>(entity =>
            {
                entity.Property(e => e.BracketsJsonString).IsRequired();

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.LastModified)
                    .HasColumnName("Last Modified")
                    .HasColumnType("datetime");

                entity.Property(e => e.TournamentName)
                    .IsRequired()
                    .HasColumnName("Tournament Name")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Tournaments)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Tournamen__Compa__4AB81AF0");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
