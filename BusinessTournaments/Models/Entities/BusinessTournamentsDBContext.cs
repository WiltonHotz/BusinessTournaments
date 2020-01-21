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
        public virtual DbSet<Tournaments> Tournaments { get; set; }


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

                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            modelBuilder.Entity<Players>(entity =>
            {
                entity.HasIndex(e => e.Name)
                    .HasName("UQ__Players__737584F6852691BE")
                    .IsUnique();

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasColumnName("CompanyID")
                    .HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Players)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Players__Company__3D5E1FD2");
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
                    .HasConstraintName("FK__T2P__PlayerID__3E52440B");

                entity.HasOne(d => d.Tournament)
                    .WithMany(p => p.T2p)
                    .HasForeignKey(d => d.TournamentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__T2P__TournamentI__3F466844");
            });

            modelBuilder.Entity<Tournaments>(entity =>
            {
                entity.Property(e => e.BracketIdstring)
                    .IsRequired()
                    .HasColumnName("BracketIDString")
                    .HasMaxLength(100);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.LastModified)
                    .HasColumnName("Last Modified")
                    .HasColumnType("datetime");

                entity.Property(e => e.PlayerIdstring)
                    .IsRequired()
                    .HasColumnName("PlayerIDString")
                    .HasMaxLength(200);

                entity.Property(e => e.TournamentName)
                    .IsRequired()
                    .HasColumnName("Tournament Name")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Tournaments)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Tournamen__Compa__403A8C7D");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
