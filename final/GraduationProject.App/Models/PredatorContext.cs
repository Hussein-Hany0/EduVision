using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace GraduationProject.App.Models;

public partial class PredatorContext : DbContext
{
    public PredatorContext()
    {
    }

    public PredatorContext(DbContextOptions<PredatorContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Lecture> Lectures { get; set; }

    public virtual DbSet<MindState> MindStates { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lecture>(entity =>
        {
            entity.ToTable("Lecture");

            entity.HasIndex(e => e.UserId, "IX_Lecture_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.Lectures).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<MindState>(entity =>
        {
            entity.ToTable("MindState");

            entity.HasIndex(e => e.UserId, "IX_MindState_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.MindStates).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
